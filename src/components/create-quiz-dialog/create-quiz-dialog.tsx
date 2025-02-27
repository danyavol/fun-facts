import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import { useCreateQuiz } from '../../services/quizzes.service.tsx';
import { useState } from 'react';
import { QuizForm } from '../quiz-form/quiz-form.tsx';
import { getDefaultQuizValue, QuizFormData } from '../quiz-form/default-quiz-form-value.ts';
import { useCurrentUser } from '../../services/auth.service.ts';

export function CreateQuizButton() {
    const [value, setValue] = useState<QuizFormData>(getDefaultQuizValue());
    const [open, setOpen] = useState(false);
    const { createQuiz, isLoading } = useCreateQuiz();
    const { user } = useCurrentUser();

    async function createNewQuiz(form: QuizFormData) {
        await createQuiz(form);
        setOpen(false);
        setValue(getDefaultQuizValue());
    }

    return (
        <>
            <Tooltip
                content={!user || user?.isAnonymous ? 'Гости не могут создавать новые квизы' : 'Создать новый квиз'}
            >
                <Button disabled={!user || user?.isAnonymous} onClick={() => setOpen(true)}>
                    Создать квиз
                </Button>
            </Tooltip>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <QuizForm
                    onCancel={() => setOpen(false)}
                    onConfirm={createNewQuiz}
                    isLoading={isLoading}
                    type="new"
                    value={value}
                />
            </Dialog.Root>
        </>
    );
}
