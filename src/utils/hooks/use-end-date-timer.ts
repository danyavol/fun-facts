import { useEffect, useState } from 'react';
import { getRealTimeOffset } from '../time-sync.ts';

export function useEndDateTimer(date: Date | string | number, withMilliseconds = false) {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [millisecondsLeft, setMillisecondsLeft] = useState(0);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        setIsEnded(false);
        const now = Date.now() + getRealTimeOffset();
        const endDate = new Date(date).getTime();
        setSecondsLeft(Math.max(Math.ceil((endDate - now) / 1000), 0));

        if (withMilliseconds) {
            setMillisecondsLeft(Math.max(Math.ceil((endDate - now) / 10) * 10, 0));
        }

        if (endDate - now <= 0) return;

        let intervalId: NodeJS.Timeout;
        const timeoutId = setTimeout(
            () => {
                if (withMilliseconds) {
                    intervalId = setInterval(() => {
                        setMillisecondsLeft((prev) => {
                            const newMilliseconds = Math.max(prev - 10, 0);
                            const newSeconds = Math.max(Math.ceil(newMilliseconds / 1000), 0);
                            setSecondsLeft(newSeconds);
                            if (newMilliseconds === 0) {
                                clearInterval(intervalId);
                                setIsEnded(true);
                            }
                            return newMilliseconds;
                        });
                    }, 10);
                } else {
                    setSecondsLeft((prev) => Math.max(prev - 1, 0));

                    intervalId = setInterval(() => {
                        setSecondsLeft((prev) => {
                            const newTime = Math.max(prev - 1, 0);
                            if (newTime === 0) {
                                clearInterval(intervalId);
                                setIsEnded(true);
                            }
                            return newTime;
                        });
                    }, 1000);
                }
            },
            withMilliseconds ? 0 : (endDate - now) % 1000
        );

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [date, withMilliseconds]);

    return { secondsLeft, millisecondsLeft, isEnded };
}
