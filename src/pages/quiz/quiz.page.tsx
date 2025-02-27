import { NavLink, useParams, useNavigate } from 'react-router';
import { useCreateFact, useEditFact, useQuizFacts } from '../../services/facts.service.ts';
import { getStatusName, useQuiz } from '../../services/quizzes.service.tsx';
import { Box, Callout, Container, Flex, Heading, IconButton, Link, Spinner, Text } from '@radix-ui/themes';
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
import { QuizStatusSelect } from './quiz-status-select.tsx';

export function QuizPage() {
    const params = useParams();
    const quizId = params.quizId || '';
    const { quiz, isLoading } = useQuiz(quizId);
    const { facts } = useQuizFacts(quizId);
    const { createFact, isLoading: isFactCreateLoading } = useCreateFact();
    const { editFact, isLoading: isEditFactLoading } = useEditFact();
    const [currentLoadingFact, setCurrentLoadingFact] = useState<string | null>(null);
    const [newFact, setNewFact] = useState<FactFormData>(getDefaultFactValue());
    const { isAdmin, user } = useCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEditFactLoading) {
            setCurrentLoadingFact(null);
        }
    }, [isEditFactLoading]);

    const canEdit = isAdmin || quiz?.ownerId === user?.uid;
    const disableEditing = ['started', 'ended'].includes(quiz?.status ?? '');

    if (!isLoading && !quiz) {
        navigate('/');
        return null;
    }

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

    const totalFacts = quiz?.totalFacts ?? 0;

    return (
        <Container size="2" p="4">
            <Box className="main-container" p="5">
                {isLoading && (
                    <Flex justify="center">
                        <Spinner size="3" />
                    </Flex>
                )}
                {!isLoading && (
                    <>
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
                                    <EditQuizButton quiz={quiz} disabled={disableEditing} />
                                    <DeleteQuizButton quizId={quiz.id} name={quiz.name} />
                                </Flex>
                            )}
                        </Flex>

                        {quiz && (
                            <Flex justify="between" align="center" gap="3">
                                <Flex align="center" gap="2">
                                    <Text>Этап:</Text>
                                    {canEdit ? (
                                        <QuizStatusSelect quiz={quiz} totalFacts={totalFacts} />
                                    ) : (
                                        <strong>{getStatusName(quiz.status)}</strong>
                                    )}
                                </Flex>
                                <Text align="right">
                                    Всего фактов в квизе: <strong>{totalFacts}</strong>
                                </Text>
                            </Flex>
                        )}

                        {quiz?.status === 'ended' && (
                            <Callout.Root my="2" size="3" color="red">
                                <Callout.Icon>
                                    <CrossCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    Квиз уже окончен 🥺{' '}
                                    <Link asChild color="red" weight="bold" underline="always">
                                        <NavLink to={'play'}>Результаты</NavLink>
                                    </Link>
                                </Callout.Text>
                            </Callout.Root>
                        )}
                        {quiz?.status === 'started' && (
                            <Callout.Root my="2" size="3" color="green">
                                <Callout.Icon>
                                    <CheckCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    Квиз уже начался! Переходи{' '}
                                    <Link asChild color="green" weight="bold" underline="always">
                                        <NavLink to={'play'}>по ссылке</NavLink>
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
                                    угадывать кому принадлежит факт. Поэтому не указывай своё имя и пол в фактах 😉.
                                    Пример:
                                    <Box as="span" mt="2">
                                        <strong>
                                            <em>
                                                Люблю лошадей. В детстве занимался(ась) конным спортом. Есть своя лошадь
                                                по имени Бэмби
                                            </em>
                                        </strong>
                                    </Box>
                                </Callout.Text>
                            </Callout.Root>
                        )}

                        {quiz && facts.length < quiz.factsLimit && quiz?.status === 'open' && (
                            <>
                                <Callout.Root my="2" size="2" color="yellow">
                                    <Callout.Icon>
                                        <ExclamationTriangleIcon />
                                    </Callout.Icon>
                                    <Callout.Text>{addMoreFactsText(quiz.factsLimit - facts.length)}</Callout.Text>
                                </Callout.Root>

                                <FactForm
                                    type="new"
                                    value={newFact}
                                    onSubmit={createNewFact}
                                    isLoading={isFactCreateLoading}
                                />
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
                                    factId={fact.id}
                                    imageUrl={fact.imageUrl}
                                ></FactForm>
                            ))}
                            {!facts?.length && (
                                <Text align="center" color="gray">
                                    Ты не добавил еще ни одного факта
                                </Text>
                            )}
                        </Flex>
                    </>
                )}
            </Box>
        </Container>
    );
}
