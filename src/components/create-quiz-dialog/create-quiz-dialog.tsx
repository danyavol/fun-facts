import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import { useCreateQuiz } from '../../services/quizzes.service.ts';
import { useState } from 'react';
import { QuizForm } from '../quiz-form/quiz-form.tsx';
import { getDefaultQuizValue, QuizFormData } from '../quiz-form/default-quiz-form-value.ts';
import { useCurrentUser } from '../../services/auth.service.ts';

export function CreateQuizButton() {
    const [value, setValue] = useState<QuizFormData>(getDefaultQuizValue());
    const [open, setOpen] = useState(false);
    const { createQuiz, isLoading } = useCreateQuiz();
    const { isAdmin } = useCurrentUser();

    async function createNewQuiz(form: QuizFormData) {
        await createQuiz(form);
        setOpen(false);
        setValue(getDefaultQuizValue());
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Tooltip content={!isAdmin ? 'Только администратор может создавать новые квизы' : 'Создать новый квиз'}>
                    <Button disabled={!isAdmin}>Создать квиз</Button>
                </Tooltip>
            </Dialog.Trigger>

            <QuizForm
                onCancel={() => setOpen(false)}
                onConfirm={createNewQuiz}
                isLoading={isLoading}
                type="new"
                value={value}
            />
        </Dialog.Root>
    );
}
