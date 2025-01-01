import { Game, Player, revokeVote, tempEndQuiz, voteForFact } from '../../../services/game.service.ts';
import { useCurrentUser } from '../../../services/auth.service.ts';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { FactImage } from '../../../components/fact-form/fact-image.tsx';

import styles from './fact-view.module.scss';
import { Me } from '../../../components/me/me.tsx';

type FactViewProps = {
    game: Game;
    displayedFact: Exclude<Game['displayedFact'], null>;
    players: Player[];
    me: Player;
};

export function FactView({ game, players, me, displayedFact }: FactViewProps) {
    const { isAdmin } = useCurrentUser();
    const fact = game.facts[Number(displayedFact.id)];
    const myAnswer: string | null = me.givenAnswers[displayedFact.id] ?? null;
    console.log(players);
    return (
        <>
            <Button onClick={() => tempEndQuiz(game)} disabled={!isAdmin}>
                Back (temp)
            </Button>
            <Text color="gray">
                Факт {Number(displayedFact.id) + 1} из {game.facts.length}
            </Text>
            <Flex direction="column" mt="2">
                <FactImage imageUrl={fact.imageUrl} readOnly={true} />
                <Box className={styles.factText}>{fact.text}</Box>
            </Flex>
            <Heading size="4" my="2" align="center">
                Чей это факт?
            </Heading>
            TODO: Add timer
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
                            disabled={myAnswer !== null && !isMyAnswer}
                            onClick={() =>
                                isMyAnswer
                                    ? revokeVote(game.id, me.id, displayedFact.id)
                                    : voteForFact(game.id, me.id, displayedFact.id, answerId)
                            }
                        >
                            {isMe && <Me type={isMyAnswer ? 'inverse' : myAnswer ? 'disabled' : 'normal'} />}
                            {answer}
                        </Button>
                    );
                })}
            </Box>
        </>
    );
}
