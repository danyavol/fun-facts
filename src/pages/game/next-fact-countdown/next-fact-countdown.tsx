import { Timestamp } from 'firebase/firestore';
import { Box, Container, Flex, Heading } from '@radix-ui/themes';
import { useEndDateTimer } from '../../../utils/hooks/use-end-date-timer.ts';

type NextFactCountdownProps = {
    date: Timestamp;
};

export function NextFactCountdown({ date }: NextFactCountdownProps) {
    const { secondsLeft } = useEndDateTimer(date.toMillis());

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
