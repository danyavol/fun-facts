import { Game, Player } from '../../../../services/game.service.ts';
import { Box, Flex, Text } from '@radix-ui/themes';

import styles from './fact-results.module.scss';
import { CheckIcon, QuestionMarkIcon } from '@radix-ui/react-icons';
import { Me } from '../../../../components/me/me.tsx';
import { PersonIcon } from '../../../../icons/person.tsx';

type FactResultsType = {
    players: Player[];
    me: Player;
    game: Game;
    fact: Exclude<Game['displayedFact'], null>;
};

export function FactResults({ players, me, game, fact }: FactResultsType) {
    const myAnswerId = me.givenAnswers[fact.id];
    const correctAnswerId = game.correctAnswers[fact.id] ?? null;
    return (
        <Box className={styles.answersList}>
            {game.answers.map((answer, answerIndex) => {
                const answerId = String(answerIndex);
                const votesNumber = players.filter((player) => player.givenAnswers[fact.id] === answerId).length;
                console.log(myAnswerId === answerId);
                return (
                    <Flex
                        key={answerIndex}
                        className={`${styles.answer} ${myAnswerId === answerId ? styles.selected : ''}`}
                        gap="1"
                    >
                        <Flex className={styles.rightAnswerCheckbox} align="center">
                            {correctAnswerId === answerId && <CheckIcon height={30} width={30} color="green" />}
                            {correctAnswerId === null && <QuestionMarkIcon height={30} width={30} color="gray" />}
                        </Flex>
                        <Flex direction="column" width="100%">
                            <Flex gap="1" align="center">
                                {me.id === answerId && <Me type="normal" />}
                                <Text weight="medium" color="indigo">
                                    {answer}
                                </Text>
                            </Flex>
                            <Flex direction="row-reverse" className={styles.votes}>
                                {Array.from(Array(votesNumber)).map((_value, index) => (
                                    <PersonIcon
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
    );
}
