import { Dialog, IconButton } from '@radix-ui/themes';
import { Quiz, useEditQuiz } from '../../services/quizzes.service.tsx';
import { useEffect, useState } from 'react';
import { QuizForm } from '../quiz-form/quiz-form.tsx';
import { QuizFormData } from '../quiz-form/default-quiz-form-value.ts';
import { Pencil2Icon } from '@radix-ui/react-icons';

export function EditQuizButton({ quiz }: { quiz: Quiz }) {
    const [value, setValue] = useState<QuizFormData>({
        name: quiz.name,
        answers: quiz.answers,
        factsLimit: quiz.factsLimit,
    });
    const [open, setOpen] = useState(false);
    const { editQuiz, isLoading } = useEditQuiz();

    useEffect(() => {
        setValue({ name: quiz.name, answers: quiz.answers, factsLimit: quiz.factsLimit });
    }, [quiz]);

    async function editQuizHandler(form: QuizFormData) {
        await editQuiz({ ...form, id: quiz.id });
        setOpen(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <IconButton variant="ghost" size="2">
                    <Pencil2Icon width="20" height="20" />
                </IconButton>
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
