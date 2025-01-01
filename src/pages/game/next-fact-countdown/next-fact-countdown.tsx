import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Box, Container, Flex, Heading } from '@radix-ui/themes';
import { getRealTimeOffset } from '../../../utils/time-sync.ts';

type NextFactCountdownProps = {
    date: Timestamp;
};

export function NextFactCountdown({ date }: NextFactCountdownProps) {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const now = Date.now() + getRealTimeOffset();
        const endDate = date.toMillis();
        setSecondsLeft(Math.max(Math.ceil((endDate - now) / 1000), 0));

        if (endDate - now <= 0) return;

        let intervalId: NodeJS.Timeout;
        const timeoutId = setTimeout(
            () => {
                setSecondsLeft((prev) => Math.max(prev - 1, 0));
                intervalId = setInterval(() => {
                    setSecondsLeft((prev) => Math.max(prev - 1, 0));
                }, 1000);
            },
            (endDate - now) % 1000
        );

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [date]);

    return (
        <Container size="1" height="100vh">
            <Flex align="center" height="100%">
                <Box className="main-container" width="100%" p="5" m="4">
                    <Heading size="9" color="teal" align="center" my="9">
                        {secondsLeft}
                    </Heading>
                </Box>
            </Flex>
        </Container>
    );
}
