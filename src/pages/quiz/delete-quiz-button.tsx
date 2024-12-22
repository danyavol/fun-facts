import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { useDeleteQuiz } from '../../services/quizzes.service.ts';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function DeleteQuizButton({ quizId, name }: { quizId: string; name: string }) {
    const navigate = useNavigate();
    const { deleteQuiz, isLoading } = useDeleteQuiz();
    const [open, setOpen] = useState(false);

    async function deleteCurrentQuiz() {
        // TODO: Check permissions
        await deleteQuiz(quizId);
        setOpen(false);
        navigate('/');
    }

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger>
                <Button color="red">Delete quiz</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Delete quiz</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure you want to delete "{name}" quiz?
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <Button variant="solid" color="red" loading={isLoading} onClick={deleteCurrentQuiz}>
                        Delete
                    </Button>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
