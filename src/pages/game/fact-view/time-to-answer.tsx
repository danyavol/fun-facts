import { Game } from '../../../services/game.service.ts';
import { memo } from 'react';
import { Flex, Progress, Text } from '@radix-ui/themes';
import { useEndDateTimer } from '../../../utils/hooks/use-end-date-timer.ts';

type TimeToAnswerProps = {
    fact: Exclude<Game['displayedFact'], null>;
    forceStop?: boolean;
    timeEnded?: () => void;
};

export const TimeToAnswer = memo(({ fact, forceStop = false, timeEnded }: TimeToAnswerProps) => {
    const { secondsLeft, millisecondsLeft, isEnded } = useEndDateTimer(fact.end.toMillis(), true);
    const millisecondsMax = Math.ceil(fact.end.toMillis() - fact.start.toMillis());

    if (isEnded) timeEnded?.();

    const color = forceStop || secondsLeft <= 5 ? 'tomato' : secondsLeft <= 15 ? 'amber' : 'indigo';

    return (
        <Flex align="center" gap="2">
            <Text style={{ width: '23px' }} weight="bold" color={color} align="right">
                {forceStop ? 0 : secondsLeft}
            </Text>
            <Progress
                value={forceStop ? 0 : (millisecondsLeft / millisecondsMax) * 100}
                size="3"
                variant="surface"
                color={color}
            />
        </Flex>
    );
});
