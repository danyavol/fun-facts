import { Game, Player, showNextFact, useGamePlayerSelection } from '../../../services/game.service.ts';
import { Box, Button, Flex, Heading, Separator, Text } from '@radix-ui/themes';

import styles from './game-registration.module.scss';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useCurrentUser } from '../../../services/auth.service.ts';
import { Me } from '../../../components/me/me.tsx';
import { useTranslate } from '../../../translate/use-translate.ts';

type GameRegistrationProps = {
    game: Game;
    players: Player[];
    me: Player | null;
};

export function GameRegistration({ game, players, me }: GameRegistrationProps) {
    const { selectPlayer, deselectPlayer } = useGamePlayerSelection(game.id);
    const { isAdmin, user } = useCurrentUser();
    const { t } = useTranslate();

    const canEdit = isAdmin || game.ownerId === user?.uid;

    return (
        <>
            <Heading size="5" align="center" mb="2">
                {game.displayedFact
                    ? t('game.registration.title.quiz-started')
                    : t('game.registration.title.quiz-registration')}
            </Heading>
            <Text as="p" align="center" mb="4">
                {t('game.registration.select-yourself')}
            </Text>
            <Flex direction="column" gap="3">
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
                                {isMe && <Me type="inverse" />}
                                {answer}
                            </Button>
                            <Box className={styles.status}>
                                {isTaken && (
                                    <Flex align="center">
                                        <CheckIcon color="green" height={22} width={22} />
                                        <Text color="green" weight="bold">
                                            {t('game.registration.ready')}
                                        </Text>
                                    </Flex>
                                )}
                                {!isTaken && !isMe && (
                                    <Flex align="center">
                                        <Cross2Icon color="red" height={22} width={22} />
                                        <Text color="red" weight="bold">
                                            {t('game.registration.not-ready')}
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Flex>
            {canEdit && (
                <>
                    <Separator size="4" mt="5" mb="3" />
                    <Flex justify="end">
                        <Button onClick={() => showNextFact(game, '0')} disabled={!!game.displayedFact}>
                            {t('game.registration.start')}
                        </Button>
                    </Flex>
                </>
            )}
        </>
    );
}
