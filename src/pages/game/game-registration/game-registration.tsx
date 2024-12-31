import { Game, Player } from '../../../services/game.service.ts';
import { Box, Button, Flex } from '@radix-ui/themes';

type GameRegistrationProps = {
    game: Game;
    players: Player[];
    me: Player | null;
};

export function GameRegistration({ game, players, me }: GameRegistrationProps) {
    function selectPlayer(playerId: string) {
        console.log('Select', playerId);
    }

    function deselectPlayer() {
        console.log('Deselect', me?.id);
    }

    return (
        <Flex direction="column" gap="3">
            {game.answers.map((answer, index) => {
                const playerId = String(index);
                const isTaken = players.some((player) => player.id === playerId);
                const isMe = me?.id === playerId;
                return (
                    <Flex gap="5">
                        <Button
                            size="3"
                            variant="ghost"
                            disabled={isTaken}
                            onClick={() => (isMe ? deselectPlayer() : selectPlayer(playerId))}
                        >
                            {answer}
                            {isMe ? 'Я' : null}
                        </Button>
                        {isTaken && 'Готов'}
                        {isMe && 'Я'}
                        {!isTaken && !me && 'Не готов'}
                    </Flex>
                );
            })}
        </Flex>
    );
}
