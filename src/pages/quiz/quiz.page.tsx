import { useNavigate, useParams } from 'react-router';
import { useQuizFacts } from '../../services/facts.service.ts';
import { useQuiz } from '../../services/quizzes.service.ts';
import { Container } from '@radix-ui/themes';

export function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { quiz, isLoading: isQuizLoading } = useQuiz(quizId || '');
    const { facts, isLoading } = useQuizFacts(quizId || '');

    return (
        <Container size="2" p="3">
            {JSON.stringify(quiz)}
            {JSON.stringify(facts)}
        </Container>
    );
}
