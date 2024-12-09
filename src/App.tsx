import './App.css';
import { Button } from '@radix-ui/themes';
import { useCreateQuiz, useQuizzesList } from './services/quizzes.service.ts';
import { signInViaGoogle, useCurrentUser } from './services/auth.service.ts';
import { useCreateFact } from './services/facts.service.ts';

function App() {
    const { quizzes } = useQuizzesList();
    const { createQuiz } = useCreateQuiz();
    const { createFact } = useCreateFact();
    const currentUser = useCurrentUser();

    // TODO: Issues with permissions in firebase
    return (
        <>
            <div>
                <Button onClick={() => createQuiz({ name: 'Test quiz' })}>Create quiz</Button>
            </div>

            {!!quizzes.length && (
                <div>
                    <Button onClick={() => createFact({ text: 'Test quiz', quizId: quizzes[0].id })}>
                        Create fact
                    </Button>
                </div>
            )}

            {currentUser?.isAnonymous && (
                <div>
                    <Button onClick={signInViaGoogle}>Sign in via google</Button>
                </div>
            )}

            <h2>All quizzes:</h2>

            {quizzes.map((quiz, index) => (
                <div key={quiz.id}>
                    {index + 1}) {quiz.name} ({quiz.id})
                </div>
            ))}
        </>
    );
}

export default App;
