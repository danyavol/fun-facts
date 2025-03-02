import { AlertDialog, Button, Flex, Text, Select } from '@radix-ui/themes';
import { getStatusName, Quiz, useEditQuiz } from '../../services/quizzes.service.tsx';
import { useState } from 'react';
import { LockClosedIcon } from '@radix-ui/react-icons';
import styles from './quiz-status-select.module.scss';
import { useTranslate } from '../../translate/use-translate.ts';

export function QuizStatusSelect({ quiz, totalFacts }: { quiz: Quiz; totalFacts: number }) {
    const { editQuiz, isLoading } = useEditQuiz();
    const [pendingValue, setPendingValue] = useState<Quiz['status']>(quiz.status);
    const [open, setOpen] = useState(false);
    const { t } = useTranslate();

    function changeValue(status: Quiz['status']) {
        setPendingValue(status);
        setOpen(true);
    }

    async function confirmChange() {
        await editQuiz({ id: quiz.id, status: pendingValue });
        setOpen(false);
    }

    function cancelChange() {
        setPendingValue(quiz.status);
        setOpen(false);
    }

    const openEnabled = ['open', 'started'].includes(quiz.status);
    const startedEnabled = quiz.status !== 'ended' && totalFacts > 0;
    const endedEnabled = quiz.status === 'ended';

    return (
        <>
            <Select.Root value={quiz.status} onValueChange={(status: Quiz['status']) => changeValue(status)}>
                <Select.Trigger />
                <Select.Content variant="soft">
                    <Select.Item value="open" disabled={!openEnabled}>
                        {!openEnabled && <LockClosedIcon className={styles.statusLock} />}
                        {getStatusName(t, 'open', !openEnabled)}
                    </Select.Item>
                    <Select.Item value="started" disabled={!startedEnabled}>
                        {!startedEnabled && <LockClosedIcon className={styles.statusLock} />}
                        {getStatusName(t, 'started', !startedEnabled)}
                    </Select.Item>
                    <Select.Item value="ended" disabled={!endedEnabled}>
                        {!endedEnabled && <LockClosedIcon className={styles.statusLock} />}
                        {getStatusName(t, 'ended', !endedEnabled)}
                    </Select.Item>
                </Select.Content>
            </Select.Root>

            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth="500px">
                    <AlertDialog.Title>{t('quiz.status-change.title')}</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        {pendingValue === 'open' && (
                            <>
                                {t('quiz.status-change.beginning')} {getStatusName(t, pendingValue)}{' '}
                                {t('quiz.status-change.to.preparation')}
                            </>
                        )}
                        {pendingValue === 'started' && (
                            <>
                                {t('quiz.status-change.beginning')} {getStatusName(t, pendingValue)}{' '}
                                {t('quiz.status-change.to.started')}
                            </>
                        )}
                        {pendingValue === 'ended' && (
                            <>
                                {t('quiz.status-change.beginning')} {getStatusName(t, pendingValue)}{' '}
                                {t('quiz.status-change.to.ended')}
                            </>
                        )}
                        <Text mt="2" style={{ display: 'block' }}>
                            {t('quiz.status-change.confirm.text')}
                        </Text>
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={cancelChange}>
                            {t('general.cancel')}
                        </Button>
                        <Button variant="solid" loading={isLoading} onClick={confirmChange}>
                            {t('quiz.status-change.confirm.button')}
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    );
}
