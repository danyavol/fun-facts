import { Game, Player, revokeVote, voteForFact } from '../../../services/game.service.ts';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { FactImage } from '../../../components/fact-form/fact-image.tsx';

import styles from './fact-view.module.scss';
import { Me } from '../../../components/me/me.tsx';
import { TimeToAnswer } from './time-to-answer.tsx';
import { useEffect, useState } from 'react';
import { FactResults } from './fact-results/fact-results.tsx';
import { getRealTimeOffset } from '../../../utils/time-sync.ts';
import { useTranslate } from '../../../translate/use-translate.ts';

type FactViewProps = {
    game: Game;
    displayedFact: Exclude<Game['displayedFact'], null>;
    players: Player[];
    me: Player;
};

export function FactView({ game, players, me, displayedFact }: FactViewProps) {
    const fact = game.facts[Number(displayedFact.id)];
    const [votingEnded, setVotingEnded] = useState(false);
    const { t } = useTranslate();

    useEffect(() => {
        const isEnded =
            players.every((player) => player.givenAnswers[displayedFact.id] != null) ||
            displayedFact.end.toMillis() < Date.now() + getRealTimeOffset();

        setVotingEnded(isEnded);
    }, [displayedFact, players]);

    const myAnswer: string | null = me.givenAnswers[displayedFact.id] ?? null;
    const correctAnswerId: string | null = game.correctAnswers[displayedFact.id];

    return (
        <>
            <Text color="gray" weight="medium">
                {t('game.fact-view.fact')} {Number(displayedFact.id) + 1} {t('game.fact-view.fact.out-of')}{' '}
                {game.facts.length}
            </Text>
            <Flex direction="column" mt="1">
                {fact.imageUrl != null && <FactImage imageUrl={fact.imageUrl} readOnly={true} />}
                <Box className={`${styles.factText} ${fact.imageUrl == null ? styles.noImage : ''}`}>{fact.text}</Box>
            </Flex>
            <Flex direction="column" justify="center" height="50px" my="3">
                {votingEnded && correctAnswerId == null && (
                    <>
                        <Heading align="center" size="4">
                            {t('game.fact-view.voting-ended')}
                        </Heading>
                        <Text align="center" className={styles.smallLineHeight}>
                            {t('game.fact-view.voting-ended.hint')}
                        </Text>
                    </>
                )}
                {votingEnded && correctAnswerId != null && (
                    <>
                        {correctAnswerId === myAnswer && (
                            <Heading align="center" size="6" color="green">
                                {t('game.fact-view.voting-ended.correct')}
                            </Heading>
                        )}
                        {myAnswer != null && correctAnswerId !== myAnswer && (
                            <Heading align="center" size="6" color="red">
                                {t('game.fact-view.voting-ended.incorrect')}
                            </Heading>
                        )}
                        {myAnswer == null && (
                            <Heading align="center" size="6" color="gray">
                                {/* Wrapped emoji in Text to make opacity 100% */}
                                {t('game.fact-view.voting-ended.no-vote')} <Text color="indigo">😴</Text>
                            </Heading>
                        )}
                    </>
                )}
                {!votingEnded && (
                    <>
                        <Heading size="4" mb="2" align="center">
                            {t('game.fact-view.choose-answer')}
                        </Heading>
                        <TimeToAnswer fact={displayedFact} timeEnded={() => setVotingEnded(true)} />
                    </>
                )}
            </Flex>

            {votingEnded && <FactResults players={players} fact={displayedFact} game={game} me={me} />}
            {!votingEnded && (
                <>
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
                                    onClick={() =>
                                        isMyAnswer
                                            ? revokeVote(game.id, me.id, displayedFact.id)
                                            : voteForFact(game.id, me.id, displayedFact.id, answerId)
                                    }
                                    className={styles.answer}
                                >
                                    {isMe && <Me type={isMyAnswer ? 'inverse' : 'normal'} />}
                                    {answer}
                                </Button>
                            );
                        })}
                    </Box>
                    <Text size="1" mt="4" as="div" color="gray" style={{ fontStyle: 'italic' }}>
                        {t('game.fact-view.your-own-fact-hint')}
                    </Text>
                </>
            )}
        </>
    );
}
