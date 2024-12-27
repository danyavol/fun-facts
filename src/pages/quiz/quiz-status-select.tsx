import { AlertDialog, Button, Flex, Text, Select } from '@radix-ui/themes';
import { getStatusName, Quiz, useEditQuiz } from '../../services/quizzes.service.tsx';
import { useState } from 'react';

export function QuizStatusSelect({ quiz }: { quiz: Quiz }) {
    const { editQuiz, isLoading } = useEditQuiz();
    const [pendingValue, setPendingValue] = useState<Quiz['status']>(quiz.status);
    const [open, setOpen] = useState(false);

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

    return (
        <>
            <Select.Root value={quiz.status} onValueChange={(status: Quiz['status']) => changeValue(status)}>
                <Select.Trigger />
                <Select.Content variant="soft">
                    <Select.Item value="open">{getStatusName('open')}</Select.Item>
                    <Select.Item value="started">{getStatusName('started')}</Select.Item>
                    <Select.Item value="ended">{getStatusName('ended')}</Select.Item>
                </Select.Content>
            </Select.Root>

            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth="500px">
                    <AlertDialog.Title>Изменить этап</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        {pendingValue === 'open' && (
                            <>
                                Изменение статуса на {getStatusName(pendingValue)} откроет участникам возможность менять
                                свои факты.
                            </>
                        )}
                        {pendingValue === 'started' && (
                            <>
                                Изменение статуса на {getStatusName(pendingValue)} запретит участникам менять свои факты
                                и начнет квиз.
                            </>
                        )}
                        {pendingValue === 'ended' && (
                            <>Изменение статуса на {getStatusName(pendingValue)} завершит квиз.</>
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
