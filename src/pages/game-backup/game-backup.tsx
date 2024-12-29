import { useParams } from 'react-router';
import { useGame } from '../../services/game.service.ts';
import { Box, Button, Container, Flex, Separator, Spinner, Text } from '@radix-ui/themes';
import styles from './game-backup.module.scss';
import { useState } from 'react';

export function GameBackupPage() {
    const { gameId } = useParams();
    if (typeof gameId !== 'string') throw new Error('Missing gameId');

    const game = useGame(gameId);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const totalFacts = game?.facts.length ?? 0;
    const fact = game?.facts[currentFactIndex];

    function nextFact() {
        setCurrentFactIndex(Math.min(currentFactIndex + 1, totalFacts));
    }

    function prevFact() {
        setCurrentFactIndex(Math.max(currentFactIndex - 1, 0));
    }

    return (
        <Container size="4" p="4">
            {!game && (
                <Box className="main-container" p="5">
                    <Flex justify="center">
                        <Spinner size="3" />
                    </Flex>
                </Box>
            )}
            <Flex direction="column" gap="9">
                {fact && (
                    <Flex direction="column" className="main-container" p="5">
                        <Text color="gray">
                            Факт {currentFactIndex + 1} из {totalFacts}
                        </Text>
                        <Flex my="3" justify="between">
                            <Button onClick={prevFact} disabled={currentFactIndex <= 0}>
                                Предыдущий
                            </Button>
                            <Button onClick={nextFact} disabled={currentFactIndex >= totalFacts - 1}>
                                Следующий
                            </Button>
                        </Flex>
                        <Separator size="4" mb="3" />
                        {fact.imageUrl && (
                            <Box mb="3">
                                <img src={fact.imageUrl} className={styles.image} alt="Фото к факту" />
                            </Box>
                        )}
                        <Text>{fact.text}</Text>
                    </Flex>
                )}
            </Flex>
        </Container>
    );
}
