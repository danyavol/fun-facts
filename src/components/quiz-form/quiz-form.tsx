import { Box, Button, Dialog, Flex, IconButton, Slider, Text, TextField } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { getDefaultQuizValue, QuizFormData } from './default-quiz-form-value.ts';
import styles from './quiz-form.module.scss';

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
    const [factsLimit, setFactsLimit] = useState(value.factsLimit);

    // Do not allow to decrease number of facts for existing quizzes
    const minimumAllowedFacts = type === 'edit' ? value.factsLimit : 1;

    useEffect(() => {
        setName(value.name ?? '');
        setAnswers(value.answers ?? []);
        setFactsLimit(value.factsLimit ?? 3);
    }, [value]);

    async function submit() {
        if (!name || name.length > 60 || !answersValid()) return;

        const trimmedAnswers = answers.reduce((result, current) => {
            const trimmed = current.trim();
            if (trimmed.length) result.push(trimmed);
            return result;
        }, [] as string[]);

        onConfirm({ name, answers: trimmedAnswers, factsLimit: factsLimit });
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
        <Dialog.Content
            maxWidth="450px"
            onOpenAutoFocus={(e) => e.preventDefault()}
            aria-describedby={'Заполни форму квиза'}
        >
            <Dialog.Title>{type == 'new' ? 'Создать новый квиз' : 'Изменить квиз'}</Dialog.Title>
            {/* Needed to avoid warning */}
            <Dialog.Description style={{ display: 'none' }}></Dialog.Description>

            <Flex direction="column" gap="3" mb="4">
                <label>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Название
                    </Text>
                    <TextField.Root
                        autoFocus
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введи название квиза"
                    />
                </label>
            </Flex>

            <Flex justify="between" mb="2" align="end">
                <Box>
                    <Text as="div" size="2" weight="bold">
                        Имена игроков
                    </Text>
                    <Text as="div" size="2" color="gray" trim="both">
                        Используются в качестве ответов в квизе
                    </Text>
                </Box>

                <IconButton size="1" onClick={addAnswer}>
                    <PlusIcon />
                </IconButton>
            </Flex>

            <Flex direction="column" gap="2" mb="4">
                {answers.map((answer, answerId) => (
                    <Flex align="center" gap="2" key={answerId}>
                        <Box flexGrow="1">
                            <TextField.Root
                                value={answer}
                                onChange={(e) => setAnswer(answerId, e.target.value)}
                                placeholder={'Введи имя'}
                            />
                        </Box>
                        <IconButton size="1" variant="ghost" color="gray" mr="1" onClick={() => removeAnswer(answerId)}>
                            <Cross2Icon />
                        </IconButton>
                    </Flex>
                ))}
            </Flex>

            <Flex direction="column">
                <Box mb="1">
                    <Text as="div" size="2" weight="bold">
                        Лимит фактов для игрока
                    </Text>
                    {type === 'edit' && (
                        <Text as="div" size="2" color="gray" trim="both" mb="2">
                            Нельзя уменьшать количество фактов
                        </Text>
                    )}
                </Box>
                <Slider
                    value={[factsLimit]}
                    onValueChange={([value]) => {
                        if (value < minimumAllowedFacts) return;
                        setFactsLimit(value);
                    }}
                    size="2"
                    min={0}
                    max={5}
                />
                <Flex justify="between" className={styles.sliderLabels} mt="1">
                    <div></div>
                    <div className={minimumAllowedFacts > 1 ? styles.disabled : ''}>1</div>
                    <div className={minimumAllowedFacts > 2 ? styles.disabled : ''}>2</div>
                    <div className={minimumAllowedFacts > 3 ? styles.disabled : ''}>3</div>
                    <div className={minimumAllowedFacts > 4 ? styles.disabled : ''}>4</div>
                    <div>5</div>
                </Flex>
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
