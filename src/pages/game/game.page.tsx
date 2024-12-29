import { useParams } from 'react-router';
import { useGame, useGamePlayers } from '../../services/game.service.ts';
import { Box, Container } from '@radix-ui/themes';

export function GamePage() {
    const { gameId } = useParams();
    if (typeof gameId !== 'string') throw new Error('Missing gameId');

    const game = useGame(gameId);
    const { players, me } = useGamePlayers(gameId);

    return (
        <Container size="2" p="4">
            <Box className="main-container" p="5">
                {JSON.stringify(game)}
                {JSON.stringify(me)}
                {JSON.stringify(players)}
            </Box>
        </Container>
    );
}