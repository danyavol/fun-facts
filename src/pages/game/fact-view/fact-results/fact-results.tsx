import {
    endQuizAndGame,
    Game,
    Player,
    setCorrectAnswer,
    showNextFact,
    unknownAnswerId,
} from '../../../../services/game.service.ts';
import { Box, Button, Flex, Select, Separator, Text, AlertDialog } from '@radix-ui/themes';

import styles from './fact-results.module.scss';
import { CheckIcon, Cross2Icon, QuestionMarkIcon } from '@radix-ui/react-icons';
import { Me } from '../../../../components/me/me.tsx';
import { PersonIcon } from '../../../../icons/person.tsx';
import { useCurrentUser } from '../../../../services/auth.service.ts';

type FactResultsType = {
    players: Player[];
    me: Player;
    game: Game;
    fact: Exclude<Game['displayedFact'], null>;
};

export function FactResults({ players, me, game, fact }: FactResultsType) {
    const { isAdmin, user } = useCurrentUser();

    const canEdit = isAdmin || game.ownerId === user?.uid;

    const myAnswerId = me.givenAnswers[fact.id];
    const correctAnswerId: string | undefined = game.correctAnswers[fact.id];

    const nextFactId = Number(fact.id) + 1;
    const isLastFact = !game.facts[nextFactId];

    return (
        <>
            <Box className={styles.answersList}>
                {game.answers.map((answer, answerIndex) => {
                    const answerId = String(answerIndex);
                    const isMyAnswer = answerId === myAnswerId;
                    const votesNumber = players.filter((player) => player.givenAnswers[fact.id] === answerId).length;

                    let status: 'wrong' | 'correct' | 'unknown';
                    let backgroundColor: string;
                    if (correctAnswerId == null) {
                        status = 'unknown';
                        backgroundColor = 'white';
                    } else if (correctAnswerId === answerId) {
                        status = 'correct';
                        backgroundColor = 'var(--green-3)';
                    } else {
                        status = 'wrong';
                        backgroundColor = 'var(--red-3)';
                    }

                    return (
                        <Flex
                            key={answerIndex}
                            className={`${styles.answer} ${isMyAnswer ? styles.selected : ''} ${styles[status]}`}
                            gap="1"
                        >
                            <Flex className={styles.rightAnswerCheckbox} align="center">
                                {status === 'correct' && <CheckIcon height={30} width={30} color="green" />}
                                {status === 'unknown' && (
                                    <QuestionMarkIcon
                                        className={styles.unknownIcon}
                                        height={30}
                                        width={30}
                                        color="gray"
                                    />
                                )}
                                {status === 'wrong' && isMyAnswer && (
                                    <Cross2Icon className={styles.wrongIcon} height={30} width={30} color="red" />
                                )}
                            </Flex>
                            <Flex direction="column" width="100%">
                                <Flex gap="1" align="center">
                                    {me.id === answerId && <Me type={isMyAnswer ? 'normal' : 'gray'} />}
                                    <Text weight="medium" color={isMyAnswer ? 'indigo' : 'gray'}>
                                        {answer}
                                    </Text>
                                </Flex>
                                <Flex direction="row-reverse" className={styles.votes}>
                                    {Array.from(Array(votesNumber)).map((_value, index) => (
                                        <PersonIcon
                                            key={index}
                                            zIndex={index}
                                            backgroundColor={backgroundColor}
                                            filled={index === votesNumber - 1 && myAnswerId === answerId}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        </Flex>
                    );
                })}
            </Box>
            {canEdit && (
                <>
                    <Separator size="4" my="4" />
                    <Text as="p" size="2" mb="2" weight="bold">
                        Выбери правильный ответ
                    </Text>
                    <Flex justify="between">
                        <Select.Root
                            value={correctAnswerId ?? unknownAnswerId}
                            onValueChange={(answerId) => setCorrectAnswer(game.id, fact.id, answerId)}
                        >
                            <Select.Trigger placeholder="Ответ" className={styles.rightAnswer} />
                            <Select.Content variant="soft">
                                {game.answers.map((answer, index) => (
                                    <Select.Item key={index} value={String(index)}>
                                        {answer}
                                    </Select.Item>
                                ))}
                                <Select.Separator />
                                <Select.Item value={unknownAnswerId}>
                                    <Text color={'red'}>Неизвестно</Text>
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>
                        {!isLastFact && (
                            <AlertDialog.Root>
                                <AlertDialog.Trigger>
                                    <Button>Далее</Button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Content maxWidth="450px">
                                    <AlertDialog.Title>Ты уверен?</AlertDialog.Title>
                                    <Flex gap="3" mt="4" justify="end">
                                        <AlertDialog.Cancel>
                                            <Button variant="soft" color="gray">
                                                Отмена
                                            </Button>
                                        </AlertDialog.Cancel>
                                        <AlertDialog.Action>
                                            <Button onClick={() => showNextFact(game, String(nextFactId))}>
                                                Далее
                                            </Button>
                                        </AlertDialog.Action>
                                    </Flex>
                                </AlertDialog.Content>
                            </AlertDialog.Root>
                        )}
                        {isLastFact && (
                            <AlertDialog.Root>
                                <AlertDialog.Trigger>
                                    <Button color="red">Завершить квиз</Button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Content maxWidth="450px">
                                    <AlertDialog.Title>Ты уверен?</AlertDialog.Title>
                                    <Flex gap="3" mt="4" justify="end">
                                        <AlertDialog.Cancel>
                                            <Button variant="soft" color="gray">
                                                Отмена
                                            </Button>
                                        </AlertDialog.Cancel>
                                        <AlertDialog.Action>
                                            <Button variant="solid" color="red" onClick={() => endQuizAndGame(game)}>
                                                Завершить квиз
                                            </Button>
                                        </AlertDialog.Action>
                                    </Flex>
                                </AlertDialog.Content>
                            </AlertDialog.Root>
                        )}
                    </Flex>
                </>
            )}
        </>
    );
}
