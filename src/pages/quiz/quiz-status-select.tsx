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
                    <AlertDialog.Title>Изменить этап</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        {pendingValue === 'open' && (
                            <>
                                Изменение статуса на {getStatusName(t, pendingValue)} откроет участникам возможность
                                менять свои факты.
                            </>
                        )}
                        {pendingValue === 'started' && (
                            <>
                                Изменение статуса на {getStatusName(t, pendingValue)} запретит участникам менять свои
                                факты и начнет квиз.
                            </>
                        )}
                        {pendingValue === 'ended' && (
                            <>Изменение статуса на {getStatusName(t, pendingValue)} завершит квиз.</>
                        )}
                        <Text mt="2" style={{ display: 'block' }}>
                            Ты уверен, что хочешь изменить этап квиза?
                        </Text>
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={cancelChange}>
                            Отмена
                        </Button>
                        <Button variant="solid" loading={isLoading} onClick={confirmChange}>
                            Изменить
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    );
}
