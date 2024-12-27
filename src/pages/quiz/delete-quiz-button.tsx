import { AlertDialog, Button, Flex, IconButton } from '@radix-ui/themes';
import { useDeleteQuiz } from '../../services/quizzes.service.tsx';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';

export function DeleteQuizButton({ quizId, name }: { quizId: string; name: string }) {
    const navigate = useNavigate();
    const { deleteQuiz, isLoading } = useDeleteQuiz();
    const [open, setOpen] = useState(false);

    async function deleteCurrentQuiz() {
        await deleteQuiz(quizId);
        setOpen(false);
        navigate('/');
    }

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger>
                <IconButton variant="ghost" size="2" color="red">
                    <TrashIcon width="20" height="20" />
                </IconButton>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Удалить квиз</AlertDialog.Title>
                <AlertDialog.Description size="2">Ты уверен, что хочешь удалить "{name}" квиз?</AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Отмена
                        </Button>
                    </AlertDialog.Cancel>
                    <Button variant="solid" color="red" loading={isLoading} onClick={deleteCurrentQuiz}>
                        Удалить
                    </Button>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
