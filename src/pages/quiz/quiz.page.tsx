import { NavLink, useParams } from 'react-router';
import { useCreateFact, useEditFact, useQuizFacts } from '../../services/facts.service.ts';
import { useQuiz } from '../../services/quizzes.service.ts';
import { Button, Callout, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { DeleteQuizButton } from './delete-quiz-button.tsx';
import { EditQuizButton } from '../../components/edit-quiz-dialog/edit-quiz-dialog.tsx';
import { FactForm } from '../../components/fact-form/fact-form.tsx';
import { useEffect, useState } from 'react';
import { FactFormData, getDefaultFactValue } from '../../components/fact-form/default-fact-form-value.ts';
import { InfoCircledIcon } from '@radix-ui/react-icons';

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

    return (
        <Container size="2" p="3">
            <Flex justify="between" mb="3">
                <Button asChild variant="outline">
                    <NavLink to={'/'}>Back</NavLink>
                </Button>
                {quiz && (
                    <Flex gap="2">
                        <EditQuizButton quiz={quiz} />
                        <DeleteQuizButton quizId={quiz.id} name={quiz.name} />
                    </Flex>
                )}
            </Flex>
            {quiz && (
                <Flex direction="column">
                    <Text>Total facts: {quiz.totalFacts}</Text>
                    <Text>Quiz name: {quiz.name}</Text>
                </Flex>
            )}

            {facts.length < maxFacts && (
                <>
                    <Callout.Root my="2" size="2">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Please add <strong>{maxFacts - facts.length} more</strong> fun facts about you.
                        </Callout.Text>
                    </Callout.Root>

                    <FactForm type="new" value={newFact} onSubmit={createNewFact} isLoading={isFactCreateLoading} />
                </>
            )}
            <Heading size="4" mt="3" mb="3">
                Your facts:
            </Heading>
            <Flex direction="column" gap="3">
                {facts?.map((fact) => (
                    <FactForm
                        key={fact.id}
                        type="edit"
                        value={fact}
                        disabled={currentLoadingFact !== fact.id && isEditFactLoading}
                        isLoading={currentLoadingFact === fact.id && isEditFactLoading}
                        onSubmit={(form) => editFactHandler(fact.id, form)}
                    ></FactForm>
                ))}
            </Flex>
        </Container>
    );
}
