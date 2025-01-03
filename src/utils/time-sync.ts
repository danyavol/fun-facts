type TimeResponse = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    seconds: number;
    milliSeconds: number;
};

const localStorageKey = 'time-offset';

/**
 * There is no guarantee that use has accurate time on his device. Therefore, we need to fetch
 * time from some server and calculated the difference between server time and local time.
 * This offset should be taken into account when working with dates.
 * */
(async function fetchRealTimeOffset() {
    // To disable browser caching we need to add { cache: 'no-store' }
    // + to ensure that browser doesn't even use old cache - we need to have unique URL every time
    const result = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=UTC&timestamp=${Date.now()}`, {
        cache: 'no-store',
    });

    const response: TimeResponse = await result.json();
    const { year, month, day, hour, minute, seconds, milliSeconds } = response;
    const nowTime = Date.now();
    const realTime = Date.UTC(year, month - 1, day, hour, minute, seconds, milliSeconds);

    const offset = realTime - nowTime;

    localStorage.setItem(localStorageKey, String(offset));
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
