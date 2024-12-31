import { useParams } from 'react-router';
import { useGame, useGamePlayers } from '../../services/game.service.ts';
import { Box, Container, Flex, Spinner } from '@radix-ui/themes';
import { GameRegistration } from './game-registration/game-registration.tsx';
import { useDateTrigger } from '../../utils/hooks/use-date-trigger.ts';
import { NextFactCountdown } from './next-fact-countdown/next-fact-countdown.tsx';
import { FactView } from './fact-view/fact-view.tsx';
import { GameResults } from './game-results/game-results.tsx';

export function GamePage() {
    const { gameId } = useParams();
    if (typeof gameId !== 'string') throw new Error('Missing gameId');

    const game = useGame(gameId);
    const { players, me } = useGamePlayers(gameId);

    const factStarted = useDateTrigger(game?.displayedFact?.start.toMillis());

    if (!game || !players) {
        return (
            <Container size="2" p="4">
                <Flex justify="center" className="main-container" p="5">
                    <Spinner size="3"></Spinner>
                </Flex>
            </Container>
        );
    }

    if (game.status === 'ended') {
        /** See game results */
        return (
            <Container size="2" p="4">
                <Box className="main-container" p="5">
                    <GameResults game={game} players={players} me={me} />
                </Box>
            </Container>
        );
    } else if (!game.displayedFact || !me) {
        /** Register for the game. Choose yourself from the list */
        return (
            <Container size="2" p="4">
                <Box className="main-container" p="5">
                    <GameRegistration game={game} players={players} me={me} />
                </Box>
            </Container>
        );
    } else if (!factStarted) {
        /** Prepare to see the next fact */
        return (
            <Container size="2" p="4">
                <Box className="main-container" p="5">
                    <NextFactCountdown game={game} players={players} me={me} />
                </Box>
            </Container>
        );
    } else {
        /** View the fact, answer and see fact results */
        return (
            <Container size="2" p="4">
                <Box className="main-container" p="5">
                    <FactView game={game} players={players} me={me} />
                </Box>
            </Container>
        );
    }
}
