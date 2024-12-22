import { Button, Dialog, Flex, TextField, Text } from '@radix-ui/themes';
import { useCreateQuiz } from '../../services/quizzes.service.ts';
import { useState } from 'react';

export function CreateQuizButton() {
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const { createQuiz, isLoading } = useCreateQuiz();

    async function createNewQuiz() {
        if (!name || name.length > 60) return;

        await createQuiz({ name });
        setOpen(false);
        setName('');
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button>Create new quiz</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Create new quiz</Dialog.Title>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Name
                        </Text>
                        <TextField.Root
                            maxLength={60}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your quiz name"
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button loading={isLoading} disabled={!name} onClick={createNewQuiz}>
                        Save
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
