import { Game, Player, revokeVote, tempEndQuiz, voteForFact } from '../../../services/game.service.ts';
import { useCurrentUser } from '../../../services/auth.service.ts';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { FactImage } from '../../../components/fact-form/fact-image.tsx';

import styles from './fact-view.module.scss';
import { Me } from '../../../components/me/me.tsx';
import { TimeToAnswer } from './time-to-answer.tsx';
import { useState } from 'react';
import { FactResults } from './fact-results/fact-results.tsx';
import { getRealTimeOffset } from '../../../utils/time-sync.ts';

type FactViewProps = {
    game: Game;
    displayedFact: Exclude<Game['displayedFact'], null>;
    players: Player[];
    me: Player;
};

export function FactView({ game, players, me, displayedFact }: FactViewProps) {
    const { isAdmin } = useCurrentUser();
    const fact = game.facts[Number(displayedFact.id)];
    const [votingEnded, setVotingEnded] = useState(false);

    (function checkIfEveryoneVoted() {
        if (votingEnded) return;
        const isEnded =
            players.every((player) => player.givenAnswers[displayedFact.id] != null) ||
            displayedFact.end.toMillis() < Date.now() + getRealTimeOffset();
        console.log(isEnded, players);
        if (isEnded) setVotingEnded(isEnded);
    })();

    const myAnswer: string | null = me.givenAnswers[displayedFact.id] ?? null;

    return (
        <>
            <Button onClick={() => tempEndQuiz(game)} disabled={!isAdmin} variant="outline">
                Back (temp)
            </Button>
            <Text color="gray">
                Факт {Number(displayedFact.id) + 1} из {game.facts.length}
            </Text>
            <Flex direction="column" mt="2">
                <FactImage imageUrl={fact.imageUrl} readOnly={true} />
                <Box className={styles.factText}>{fact.text}</Box>
            </Flex>
            <Flex direction="column" justify="center" height="50px" my="3">
                {votingEnded && (
                    <Heading align="center" size="4">
                        Голосование окончено!
                    </Heading>
                )}
                {!votingEnded && (
                    <>
                        <Heading size="4" mb="2" align="center">
                            Чей это факт?
                        </Heading>
                        <TimeToAnswer fact={displayedFact} timeEnded={() => setVotingEnded(true)} />
                    </>
                )}
            </Flex>

            {votingEnded && <FactResults players={players} fact={displayedFact} game={game} me={me} />}
            {!votingEnded && (
                <Box className={styles.answers}>
                    {game.answers.map((answer, index) => {
                        const answerId = String(index);
                        const isMe = me.id === answerId;
                        const isMyAnswer = answerId === myAnswer;
                        return (
                            <Button
                                key={index}
                                variant={isMyAnswer ? 'solid' : 'soft'}
                                size="4"
                                disabled={votingEnded || (myAnswer !== null && !isMyAnswer)}
                                onClick={() =>
                                    isMyAnswer
                                        ? revokeVote(game.id, me.id, displayedFact.id)
                                        : voteForFact(game.id, me.id, displayedFact.id, answerId)
                                }
                                className={styles.answer}
                            >
                                {isMe && <Me type={isMyAnswer ? 'inverse' : myAnswer ? 'disabled' : 'normal'} />}
                                {answer}
                            </Button>
                        );
                    })}
                </Box>
            )}
        </>
    );
}
