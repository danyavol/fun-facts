import { Box, Button, Dialog, Flex, IconButton, Slider, Text, TextField } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { getDefaultQuizValue, QuizFormData } from './default-quiz-form-value.ts';
import styles from './quiz-form.module.scss';
import { Tooltip } from '../tooltip/tooltip.tsx';

type QuizFormProps = {
    type: 'new' | 'edit';
    value?: QuizFormData;
    onCancel: () => unknown;
    onConfirm: (form: QuizFormData) => unknown;
    isLoading?: boolean;
};

const maxPlayers = 16;

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
    const [answerFocus, setAnswerFocus] = useState<number | null>(null);

    // Do not allow to decrease number of facts for existing quizzes
    const minimumAllowedFacts = type === 'edit' ? (value.factsLimit ?? 1) : 1;

    const reachedLimitOfPlayers = answers.length >= maxPlayers;

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
        if (reachedLimitOfPlayers) return;
        setAnswerFocus(answers.length);
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

                <Tooltip text={reachedLimitOfPlayers ? `Максимум ${maxPlayers} игроков` : ''}>
                    <IconButton size="1" onClick={addAnswer} disabled={reachedLimitOfPlayers}>
                        <PlusIcon />
                    </IconButton>
                </Tooltip>
            </Flex>

            <Flex direction="column" gap="2" mb="4">
                {answers.map((answer, answerId) => (
                    <Flex align="center" gap="2" key={answerId}>
                        <Box flexGrow="1">
                            <TextField.Root
                                autoFocus={answerId === answerFocus}
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
                    <div>{/* Empty element */}</div>
                    {[1, 2, 3, 4, 5].map((number) => {
                        const isDisabled = minimumAllowedFacts > number;
                        return (
                            <div
                                key={number}
                                className={isDisabled ? styles.disabled : ''}
                                onClick={() => {
                                    if (!isDisabled) setFactsLimit(number);
                                }}
                            >
                                {number}
                            </div>
                        );
                    })}
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
