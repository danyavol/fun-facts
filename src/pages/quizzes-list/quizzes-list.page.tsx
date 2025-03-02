import { getStatusName, useQuizzesList } from '../../services/quizzes.service.tsx';
import { Box, Container, Flex, Heading, Separator, Spinner, Text } from '@radix-ui/themes';

import styles from './quizzes-list.module.scss';
import { NavLink } from 'react-router';
import { CreateQuizButton } from '../../components/create-quiz-dialog/create-quiz-dialog.tsx';
import { Header } from '../../components/header/header.tsx';
import { useTranslate } from '../../translate/use-translate.ts';

export function QuizzesListPage() {
    const { quizzes, isLoading } = useQuizzesList();
    const { t } = useTranslate();

    return (
        <>
            <Header />
            <Container size="2" p="4">
                <Box className="main-container" p="5">
                    <Flex justify="between" align="center" mb="3">
                        <Heading size="4">{t('quizzes-list.your-quizzes')}</Heading>
                        <CreateQuizButton />
                    </Flex>

                    <Flex direction="column" gap="3">
                        {isLoading && (
                            <Flex justify="center">
                                <Spinner size="3" />
                            </Flex>
                        )}
                        {!isLoading &&
                            quizzes.map((quiz) => (
                                <NavLink key={quiz.id} to={`/quiz/${quiz.id}`}>
                                    <Box key={quiz.id} className={styles.quiz}>
                                        <Text as="p" truncate={true} size="5">
                                            {quiz.name}
                                        </Text>
                                        <Flex gap="3" align="center">
                                            {getStatusName(t, quiz.status)}
                                            <Separator orientation="vertical" />
                                            {quiz.totalFacts ?? 0} {t('fact.number', quiz.totalFacts ?? 0)}
                                        </Flex>
                                    </Box>
                                </NavLink>
                            ))}
                        {!isLoading && quizzes.length == 0 && (
                            <Text align="center" color="gray">
                                {t('quizzes-list.empty-state')}
                            </Text>
                        )}
                    </Flex>
                </Box>
            </Container>
        </>
    );
}
