import { useState, useEffect } from 'react';
import { getRealTimeOffset } from '../time-sync.ts';

/**
 * Custom hook to trigger when a specific date and time is reached.
 * @param targetDateTime - The target date and time as a string (ISO format recommended).
 * @returns A boolean indicating whether the target time has been reached.
 */
export function useDateTrigger(targetDateTime?: string | number | null): null | boolean {
    const [hasTimeArrived, setHasTimeArrived] = useState<boolean | null>(null);

    useEffect(() => {
        if (!targetDateTime) {
            setHasTimeArrived(null);
            return;
        }

        const targetTime = new Date(targetDateTime).getTime();
        const currentTime = Date.now() + getRealTimeOffset();
        const timeUntilTarget = targetTime - currentTime;

        if (timeUntilTarget <= 0) {
            // If the time has already passed, set the state immediately
            setHasTimeArrived(true);
            return;
        }
        setHasTimeArrived(false);

        // Set a timeout to update the state when the target time is reached
        const timer = setTimeout(() => {
            setHasTimeArrived(true);
        }, timeUntilTarget);

        // Cleanup timer on unmount or when targetDateTime changes
        return () => clearTimeout(timer);
    }, [targetDateTime]);

    return hasTimeArrived;
}
