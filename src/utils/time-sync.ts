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
    const requestSent = Date.now();
    const result = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=UTC&timestamp=${Date.now()}`, {
        cache: 'no-store',
    });
    const requestDuration = Date.now() - requestSent;
    // Compensation due to the long request time
    const latencyCompensation = requestDuration / 2;

    const response: TimeResponse = await result.json();
    const { year, month, day, hour, minute, seconds, milliSeconds } = response;
    const nowTime = Date.now();
    const realTime = Date.UTC(year, month - 1, day, hour, minute, seconds, milliSeconds + latencyCompensation);

    const offset = realTime - nowTime;

    localStorage.setItem(localStorageKey, String(offset));
    alert(
        JSON.stringify(
            {
                offset,
                requestDuration,
                resp: (response as unknown as { dateTime: string })['dateTime'],
                now: new Date(nowTime).toISOString(),
            },
            null,
            2
        )
    );
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
