import { endQuiz, Game, Player, setCorrectAnswer, showNextFact } from '../../../../services/game.service.ts';
import { Box, Button, Flex, Select, Separator, Text } from '@radix-ui/themes';

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
    const { isAdmin } = useCurrentUser();
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
                    if (correctAnswerId == null) {
                        status = 'unknown';
                    } else if (correctAnswerId === answerId) {
                        status = 'correct';
                    } else {
                        status = 'wrong';
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
                                            style={{ zIndex: index }}
                                            filled={index === votesNumber - 1 && myAnswerId === answerId}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        </Flex>
                    );
                })}
            </Box>
            {isAdmin && (
                <>
                    <Separator size="4" my="4" />
                    <Text as="p" size="2" mb="2" weight="bold">
                        Выбери правильный ответ
                    </Text>
                    <Flex justify="between">
                        <Select.Root
                            value={correctAnswerId}
                            onValueChange={(answerId) => setCorrectAnswer(game.id, fact.id, answerId)}
                        >
                            <Select.Trigger placeholder="Ответ" className={styles.rightAnswer} />
                            <Select.Content>
                                {game.answers.map((answer, index) => (
                                    <Select.Item key={index} value={String(index)}>
                                        {answer}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                        {!isLastFact && (
                            <Button
                                disabled={correctAnswerId == null}
                                onClick={() => showNextFact(game, String(nextFactId))}
                            >
                                Далее
                            </Button>
                        )}
                        {isLastFact && (
                            <Button disabled={correctAnswerId == null} onClick={() => endQuiz(game)} color="red">
                                Завершить квиз
                            </Button>
                        )}
                    </Flex>
                </>
            )}
        </>
    );
}
