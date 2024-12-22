import { useQuizzesList } from '../../services/quizzes.service.ts';
import { Box, Container, Flex, Heading, Spinner, Text } from '@radix-ui/themes';

import styles from './quizzes-list.module.scss';
import { NavLink } from 'react-router';
import { CreateQuizButton } from '../../components/create-quiz-dialog/create-quiz-dialog.tsx';

export function QuizzesListPage() {
    const { quizzes, isLoading } = useQuizzesList();

    return (
        <Container size="2" p="3">
            <Flex justify="end">
                <CreateQuizButton />
            </Flex>
            <Heading size="4" mb="3">
                Select quiz:
            </Heading>
            <Flex direction="column" gap="3">
                {isLoading && <Spinner size="3" />}
                {!isLoading &&
                    quizzes.map((quiz) => (
                        <NavLink key={quiz.id} to={`/quiz/${quiz.id}`}>
                            <Box key={quiz.id} className={styles.quiz}>
                                <Text as="p" truncate={true}>
                                    {quiz.name}
                                </Text>
                            </Box>
                        </NavLink>
                    ))}
                {!isLoading && quizzes.length == 0 && <Text>No quizzes found</Text>}
            </Flex>
        </Container>
    );
}
