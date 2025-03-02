import { Button, Dialog } from '@radix-ui/themes';
import { useCreateQuiz } from '../../services/quizzes.service.tsx';
import { useState } from 'react';
import { QuizForm } from '../quiz-form/quiz-form.tsx';
import { getDefaultQuizValue, QuizFormData } from '../quiz-form/default-quiz-form-value.ts';
import { useCurrentUser } from '../../services/auth.service.ts';
import { Tooltip } from '../tooltip/tooltip.tsx';
import { useTranslate } from '../../translate/use-translate.ts';

export function CreateQuizButton() {
    const [value, setValue] = useState<QuizFormData>(getDefaultQuizValue());
    const [open, setOpen] = useState(false);
    const { createQuiz, isLoading } = useCreateQuiz();
    const { user } = useCurrentUser();
    const { t } = useTranslate();

    const newQuizButtonDisabled = !user || user?.isAnonymous;

    async function createNewQuiz(form: QuizFormData) {
        await createQuiz(form);
        setOpen(false);
        setValue(getDefaultQuizValue());
    }

    return (
        <>
            <Tooltip text={newQuizButtonDisabled ? t('quizzes-list.create-quiz.disabled-tooltip') : ''}>
                <Button disabled={newQuizButtonDisabled} onClick={() => !newQuizButtonDisabled && setOpen(true)}>
                    {t('quizzes-list.create-quiz')}
                </Button>
            </Tooltip>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                {open && (
                    <QuizForm
                        onCancel={() => setOpen(false)}
                        onConfirm={createNewQuiz}
                        isLoading={isLoading}
                        type="new"
                        value={value}
                    />
                )}
            </Dialog.Root>
        </>
    );
}
