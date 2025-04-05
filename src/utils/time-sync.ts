import { getFunctions, httpsCallable } from 'firebase/functions';
import { NotificationService } from '../services/notification.service.tsx';
import { t } from '../translate/use-translate.ts';

const localStorageKey = 'time-offset';

const TIMEOUT_THRESHOLD = 5000;
const BASE_BACKOFF_DELAY = 1000;
const RETRY_LIMIT = 3;
const REQUEST_COUNT = 3;

type TimeSyncResponse = { offset: number; executionTime: number };

/**
 * There is no guarantee that user has accurate time on his device. Therefore, we need to fetch
 * time from some server and calculated the difference between server time and local time.
 * This offset should be taken into account when working with dates.
 * */

async function fetchServerTime(): Promise<TimeSyncResponse> {
    const startTime = Date.now();
    const result = await httpsCallable(getFunctions(undefined, 'europe-central2'), 'getServerTime', {
        timeout: TIMEOUT_THRESHOLD,
    })();
    const executionTime = Date.now() - startTime;
    if (typeof result.data === 'object' && result.data != null && 'serverTime' in result.data) {
        const offset = (result.data.serverTime as number) - Date.now();
        return { offset, executionTime };
    }
    throw new Error('No serverTime found in response.');
}

const exponentialBackoff = async (retries: number): Promise<void> => {
    const delay = BASE_BACKOFF_DELAY * Math.pow(2, RETRY_LIMIT - retries); // Exponential backoff calculation
    console.log(`Retrying in ${delay}ms...`);
    return new Promise((resolve) => setTimeout(resolve, delay));
};

async function retryRequest(retries: number): Promise<TimeSyncResponse> {
    try {
        return await fetchServerTime();
    } catch {
        if (retries > 0) {
            console.log(`Request failed, retrying... (${retries} retries left)`);
            await exponentialBackoff(retries);
            return retryRequest(retries - 1);
        }
        throw new Error('Max retries reached. Request failed.');
    }
}

async function getBestServerTime(): Promise<TimeSyncResponse> {
    const responses: TimeSyncResponse[] = [];

    // Make multiple requests
    for (let i = 0; i < REQUEST_COUNT; i++) {
        try {
            const result = await retryRequest(RETRY_LIMIT);
            // Only add the result if it's within the acceptable timeout
            if (result.executionTime <= TIMEOUT_THRESHOLD) {
                responses.push(result);
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (responses.length === 0) {
        throw new Error('Time sync failed.');
    }

    // Find the response with the lowest time
    return responses.reduce(
        (prev, current) => (prev.executionTime < current.executionTime ? prev : current),
        responses[0]
    );
}

(async function fetchRealTimeOffset() {
    try {
        const { offset, executionTime } = await getBestServerTime();

        console.log(
            `Fastest Time Sync response was ${executionTime / 1000}sec. Offset ${offset}ms is saved in localStorage`
        );
        localStorage.setItem(localStorageKey, String(offset));
    } catch (e) {
        NotificationService.showToast(t('error.time-sync-failed'), 'error', 5000);
        console.error(e);
    }
})();

export function getRealTimeOffset() {
    const stringOffset = localStorage.getItem(localStorageKey);
    if (stringOffset == null) return 0;
    try {
        return Number(stringOffset);
    } catch {
        return 0;
    }
}
