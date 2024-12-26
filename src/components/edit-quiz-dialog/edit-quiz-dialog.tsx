import { Button, Dialog } from '@radix-ui/themes';
import { Quiz, useEditQuiz } from '../../services/quizzes.service.ts';
import { useEffect, useState } from 'react';
import { QuizForm } from '../quiz-form/quiz-form.tsx';
import { QuizFormData } from '../quiz-form/default-quiz-form-value.ts';

export function EditQuizButton({ quiz }: { quiz: Quiz }) {
    const [value, setValue] = useState<QuizFormData>({ name: quiz.name, answers: quiz.answers });
    const [open, setOpen] = useState(false);
    const { editQuiz, isLoading } = useEditQuiz();

    useEffect(() => {
        console.log(123, quiz);
        setValue({ name: quiz.name, answers: quiz.answers });
    }, [quiz]);

    async function editQuizHandler(form: QuizFormData) {
        await editQuiz({ ...form, id: quiz.id });
        setOpen(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button>Edit quiz</Button>
            </Dialog.Trigger>

            <QuizForm
                onCancel={() => setOpen(false)}
                onConfirm={editQuizHandler}
                isLoading={isLoading}
                type="edit"
                value={value}
            />
        </Dialog.Root>
    );
}
