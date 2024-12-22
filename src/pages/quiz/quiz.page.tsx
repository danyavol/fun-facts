import { NavLink, useParams } from 'react-router';
import { useCreateFact, useQuizFacts } from '../../services/facts.service.ts';
import { useQuiz } from '../../services/quizzes.service.ts';
import { Button, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { DeleteQuizButton } from './delete-quiz-button.tsx';

export function QuizPage() {
    const params = useParams();
    const quizId = params.quizId || '';
    const { quiz, isLoading: isQuizLoading } = useQuiz(quizId);
    const { facts, isLoading: isFactsLoading } = useQuizFacts(quizId);
    const { createFact, isLoading: isFactCreateLoading } = useCreateFact();

    return (
        <Container size="2" p="3">
            <Flex justify="between" mb="3">
                <Button asChild variant="outline">
                    <NavLink to={'/'}>Back</NavLink>
                </Button>
                <Flex gap="2">
                    <Button>Change name</Button>
                    {quiz && <DeleteQuizButton quizId={quiz.id} name={quiz.name} />}
                </Flex>
            </Flex>
            {quiz && (
                <Flex direction="column">
                    <Text>Total facts: {quiz.totalFacts}</Text>
                    <Text>Quiz name: {quiz.name}</Text>
                </Flex>
            )}
            <Button onClick={() => createFact({ quizId, text: 'test fact' })}>Create test fact</Button>
            <Heading size="4">Facts:</Heading>
            <Flex direction="column">{facts?.map((fact) => <Text key={fact.id}>{fact.text}</Text>)}</Flex>
        </Container>
    );
}
