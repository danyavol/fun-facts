import { Game, Player, startQuiz, useGamePlayerSelection } from '../../../services/game.service.ts';
import { Badge, Box, Button, Flex, Heading, Separator, Text } from '@radix-ui/themes';

import styles from './game-registration.module.scss';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useCurrentUser } from '../../../services/auth.service.ts';

type GameRegistrationProps = {
    game: Game;
    players: Player[];
    me: Player | null;
};

export function GameRegistration({ game, players, me }: GameRegistrationProps) {
    const { selectPlayer, deselectPlayer } = useGamePlayerSelection(game.id);
    const { isAdmin } = useCurrentUser();

    return (
        <>
            <Heading size="5" align="center" mb="2">
                {game.displayedFact ? 'Квиз уже начался!' : 'Квиз скоро начнется!'}
            </Heading>
            <Text as="p" align="center" mb="4">
                Выбери своё имя из списка:
            </Text>
            <Flex direction="column" gap="5">
                {game.answers.map((answer, index) => {
                    const playerId = String(index);
                    const isTaken = players.some((player) => player.id === playerId && player.userId);
                    const isMe = me?.id === playerId;
                    return (
                        <Box className={styles.namesWrapper} key={index}>
                            <Button
                                size="2"
                                variant={isMe ? 'solid' : 'soft'}
                                disabled={isTaken && !isMe}
                                onClick={() => (isMe ? deselectPlayer(playerId) : selectPlayer(playerId, me))}
                                className={styles.name}
                            >
                                {answer}
                            </Button>
                            <Box className={styles.status}>
                                {isTaken && (
                                    <Flex align="center">
                                        <CheckIcon color="green" height={22} width={22} />
                                        <Text color="green" weight="bold">
                                            Готов
                                            {isMe && (
                                                <>
                                                    {' '}
                                                    <Badge color="indigo" size="1" variant="outline">
                                                        Я
                                                    </Badge>
                                                </>
                                            )}
                                        </Text>
                                    </Flex>
                                )}
                                {!isTaken && !isMe && (
                                    <Flex align="center">
                                        <Cross2Icon color="red" height={22} width={22} />
                                        <Text color="red" weight="bold">
                                            Не готов
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Flex>
            {isAdmin && (
                <>
                    <Separator size="4" mt="5" mb="3" />
                    <Flex justify="end">
                        <Button onClick={() => startQuiz(game)} disabled={!!game.displayedFact}>
                            Начать квиз
                        </Button>
                    </Flex>
                </>
            )}
        </>
    );
}
