import { Game, Player } from '../../../services/game.service.ts';
import { Flex, Heading, IconButton, Table } from '@radix-ui/themes';
import { useMemo } from 'react';

import styles from './game-results.module.scss';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { NavLink } from 'react-router';
import { useTranslate } from '../../../translate/use-translate.ts';

type GameResultsProps = {
    game: Game;
    players: Player[];
    me: Player | null;
};

type Leaderboard = {
    points: number;
    players: { id: string; name: string }[];
}[];

export function GameResults({ game, players }: GameResultsProps) {
    const { t } = useTranslate();

    const leaderboard: Leaderboard = useMemo(() => {
        const points: Record<string, number> = {};
        players.forEach((player) => {
            points[player.id] = 0;

            Object.entries(player.givenAnswers).forEach(([factId, answerId]) => {
                const correctAnswerId = game.correctAnswers[factId];

                // Skip skipped facts, incorrect answers and answers to own facts
                if (correctAnswerId == null || correctAnswerId !== answerId || player.id === correctAnswerId) return;

                points[player.id] += 1;
            });
        });

        const sortedPoints = Object.entries(points).sort(([, s1], [, s2]) => s2 - s1);

        const leaderboard: Leaderboard = [];
        let currentPlace = -1;
        sortedPoints.forEach(([playerId, points]) => {
            if (leaderboard[currentPlace] === undefined || leaderboard[currentPlace].points !== points) {
                currentPlace += 1;
                leaderboard[currentPlace] = {
                    points: points,
                    players: [],
                };
            }
            leaderboard[currentPlace].players.push({ id: playerId, name: game.answers[Number(playerId)] });
        });

        return leaderboard;
    }, [game, players]);

    return (
        <>
            <Flex mb="2" align="center">
                <IconButton asChild variant="ghost" size="2">
                    <NavLink to={`/quiz/${game.id}`}>
                        <ArrowLeftIcon width={24} height={24} />
                    </NavLink>
                </IconButton>
                <Heading align="center" color="indigo" style={{ flexGrow: 1 }}>
                    {t('game.results.title')}
                </Heading>
            </Flex>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell width="0px" align="center">
                            {t('game.results.table.position')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('game.results.table.name')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="right">{t('game.results.table.score')}</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {leaderboard.map((data, index) => (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell className={index <= 2 ? styles.medal : ''} align="center">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </Table.RowHeaderCell>
                            <Table.Cell className={styles[`place-${index + 1}-name`]}>
                                {data.players.map((p) => p.name).join(', ')}
                            </Table.Cell>
                            <Table.Cell align="right" className={styles[`place-${index + 1}-points`]}>
                                {data.points}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    );
}
