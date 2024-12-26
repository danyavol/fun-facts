import { NavLink, useParams } from 'react-router';
import { useCreateFact, useEditFact, useQuizFacts } from '../../services/facts.service.ts';
import { getStatusName, useQuiz } from '../../services/quizzes.service.ts';
import { Box, Button, Callout, Container, Flex, Heading, IconButton, Link, Text } from '@radix-ui/themes';
import { DeleteQuizButton } from './delete-quiz-button.tsx';
import { EditQuizButton } from '../../components/edit-quiz-dialog/edit-quiz-dialog.tsx';
import { FactForm } from '../../components/fact-form/fact-form.tsx';
import { useEffect, useState } from 'react';
import { FactFormData, getDefaultFactValue } from '../../components/fact-form/default-fact-form-value.ts';
import {
    ArrowLeftIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
} from '@radix-ui/react-icons';
import { ruPluralText } from '../../utils/plural.ts';
import { useCurrentUser } from '../../services/auth.service.ts';

const maxFacts = 3;

export function QuizPage() {
    const params = useParams();
    const quizId = params.quizId || '';
    const { quiz, isLoading: isQuizLoading } = useQuiz(quizId);
    const { facts, isLoading: isFactsLoading } = useQuizFacts(quizId);
    const { createFact, isLoading: isFactCreateLoading } = useCreateFact();
    const { editFact, isLoading: isEditFactLoading } = useEditFact();
    const [currentLoadingFact, setCurrentLoadingFact] = useState<string | null>(null);
    const [newFact, setNewFact] = useState<FactFormData>(getDefaultFactValue());
    const { isAdmin, user } = useCurrentUser();

    const canEdit = isAdmin || quiz?.ownerId === user?.uid;

    useEffect(() => {
        if (!isEditFactLoading) {
            setCurrentLoadingFact(null);
        }
    }, [isEditFactLoading]);

    async function createNewFact(factData: FactFormData) {
        if (!quiz) return;
        await createFact({ quizId: quiz.id, ...factData });
        setNewFact(getDefaultFactValue());
    }

    async function editFactHandler(factId: string, factData: FactFormData) {
        setCurrentLoadingFact(factId);
        await editFact({ id: factId, ...factData });
    }

    function addMoreFactsText(facts: number) {
        const ending = ruPluralText(facts, {
            one: 'интересный факт',
            few: 'интересных факта',
            many: 'интересных фактов',
        });
        return (
            <>
                Пожалуйста, добавь еще <strong>{facts}</strong> {ending} о себе.
            </>
        );
    }

    return (
        <Container size="2" p="4">
            <Box className="main-container" p="5">
                <Flex justify="start" gap="4" align="center" mb="3">
                    <IconButton asChild variant="ghost" size="2">
                        <NavLink to={'/'}>
                            <ArrowLeftIcon width={24} height={24} />
                        </NavLink>
                    </IconButton>
                    {quiz && (
                        <Box flexGrow="1">
                            <Heading>{quiz.name}</Heading>
                        </Box>
                    )}
                    {quiz && canEdit && (
                        <Flex gap="4" justify="end" align="center">
                            <EditQuizButton quiz={quiz} />
                            <DeleteQuizButton quizId={quiz.id} name={quiz.name} />
                        </Flex>
                    )}
                </Flex>

                {quiz && (
                    <Flex justify="between">
                        <Text>
                            Этап: <strong>{getStatusName(quiz.status)}</strong>
                        </Text>
                        <Text>
                            Всего фактов в квизе: <strong>{quiz.totalFacts ?? 0}</strong>
                        </Text>
                    </Flex>
                )}

                {quiz?.status === 'ended' && (
                    <Callout.Root my="2" size="3" color="red">
                        <Callout.Icon>
                            <CrossCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>Квиз уже окончен 🥺</Callout.Text>
                    </Callout.Root>
                )}
                {quiz?.status === 'started' && (
                    <Callout.Root my="2" size="3" color="green">
                        <Callout.Icon>
                            <CheckCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Квиз уже начался! Переходи{' '}
                            <Link asChild color="green" weight="bold">
                                <NavLink to={'play'}>ПО ССЫЛКЕ</NavLink>
                            </Link>{' '}
                            и участвуй!
                        </Callout.Text>
                    </Callout.Root>
                )}

                {quiz?.status === 'open' && (
                    <Callout.Root my="2" size="2">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Придумай что-нибудь интересное или необычное о себе. Во время квиза участники будут
                            угадывать кому принадлежит факт. Поэтому не указывай своё имя и пол в фактах 😉. Пример:
                            <Box mt="2">
                                <strong>
                                    <em>
                                        Люблю лошадей. В детстве занимался(ась) конным спортом. Есть своя лошадь по
                                        имени Бэмби
                                    </em>
                                </strong>
                            </Box>
                        </Callout.Text>
                    </Callout.Root>
                )}

                {facts.length < maxFacts && quiz?.status === 'open' && (
                    <>
                        <Callout.Root my="2" size="2" color="yellow">
                            <Callout.Icon>
                                <ExclamationTriangleIcon />
                            </Callout.Icon>
                            <Callout.Text>{addMoreFactsText(maxFacts - facts.length)}</Callout.Text>
                        </Callout.Root>

                        <FactForm type="new" value={newFact} onSubmit={createNewFact} isLoading={isFactCreateLoading} />
                    </>
                )}

                <Heading size="4" mt="3" mb="3">
                    Твои факты:
                </Heading>
                <Flex direction="column" gap="3">
                    {facts?.map((fact) => (
                        <FactForm
                            key={fact.id}
                            type="edit"
                            value={fact}
                            readonlyForm={quiz?.status !== 'open'}
                            disabled={currentLoadingFact !== fact.id && isEditFactLoading}
                            isLoading={currentLoadingFact === fact.id && isEditFactLoading}
                            onSubmit={(form) => editFactHandler(fact.id, form)}
                        ></FactForm>
                    ))}
                    {!facts?.length && (
                        <Text align="center" color="gray">
                            Ты не добавил еще ни одного факта
                        </Text>
                    )}
                </Flex>
            </Box>
        </Container>
    );
}
