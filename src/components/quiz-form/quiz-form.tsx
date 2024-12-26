import { Box, Button, Dialog, Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { getDefaultQuizValue, QuizFormData } from './default-quiz-form-value.ts';

type QuizFormProps = {
    type: 'new' | 'edit';
    value?: QuizFormData;
    onCancel: () => unknown;
    onConfirm: (form: QuizFormData) => unknown;
    isLoading?: boolean;
};

export function QuizForm({
    type,
    onCancel,
    onConfirm,
    value = getDefaultQuizValue(),
    isLoading = false,
}: QuizFormProps) {
    const [name, setName] = useState(value.name);
    const [answers, setAnswers] = useState<string[]>(value.answers);

    useEffect(() => {
        setName(value.name ?? '');
        setAnswers(value.answers ?? []);
    }, [value]);

    async function submit() {
        if (!name || name.length > 60 || !answersValid()) return;

        const trimmedAnswers = answers.reduce((result, current) => {
            const trimmed = current.trim();
            if (trimmed.length) result.push(trimmed);
            return result;
        }, [] as string[]);

        onConfirm({ name, answers: trimmedAnswers });
    }

    function answersValid() {
        return answers.some((answer) => !!answer.trim().length);
    }

    function setAnswer(answerId: number, answer: string) {
        const newAnswers = [...answers];
        newAnswers[answerId] = answer;
        setAnswers(newAnswers);
    }

    function addAnswer() {
        setAnswers([...answers, '']);
    }

    function removeAnswer(answerId: number) {
        const newAnswers = [...answers];
        newAnswers.splice(answerId, 1);
        setAnswers(newAnswers);
    }

    return (
        <Dialog.Content maxWidth="450px">
            <Dialog.Title>{type == 'new' ? 'Создать новый квиз' : 'Изменить квиз'}</Dialog.Title>

            <Flex direction="column" gap="3" mb="4">
                <label>
                    <Text as="div" size="2" mb="2" weight="bold">
                        Название
                    </Text>
                    <TextField.Root
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введи название квиза"
                    />
                </label>
            </Flex>

            <Flex justify="between" mb="2">
                <Text as="div" size="2" weight="bold">
                    Имена участников (варианты ответов)
                </Text>
                <IconButton size="1" onClick={addAnswer}>
                    <PlusIcon />
                </IconButton>
            </Flex>
            <Flex direction="column" gap="2">
                {answers.map((answer, answerId) => (
                    <Flex align="center" gap="2" key={answerId}>
                        <Box flexGrow="1">
                            <TextField.Root
                                value={answer}
                                onChange={(e) => setAnswer(answerId, e.target.value)}
                                placeholder={'Введи ответ'}
                            />
                        </Box>
                        <IconButton size="1" variant="ghost" color="gray" mr="1" onClick={() => removeAnswer(answerId)}>
                            <Cross2Icon />
                        </IconButton>
                    </Flex>
                ))}
            </Flex>

            <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" color="gray" onClick={onCancel}>
                    Отмена
                </Button>
                <Button loading={isLoading} disabled={!name || !answersValid()} onClick={submit}>
                    Сохранить
                </Button>
            </Flex>
        </Dialog.Content>
    );
}
