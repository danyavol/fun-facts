import { getDatabase, onValue, push, ref, update, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.service.ts';

type RawQuiz = {
    name: string;
    ownerId: string;
    totalFacts: number;
    createdAt: string;
    updatedAt: string;
};

type RawQuizzes = {
    [quizId: string]: RawQuiz;
};

export type Quiz = RawQuiz & {
    id: string;
};

export function useQuizzesList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const unsubscribe = onValue(
        ref(getDatabase(), `quizzes`),
        (snapshot) => {
            const rawData = snapshot.val() as RawQuizzes | null;
            const data = Object.entries(rawData ?? {}).map(
                ([key, value]): Quiz => ({
                    id: key,
                    ...value,
                })
            );
            setQuizzes(data);
            if (isLoading) setIsLoading(false);
        },
        (e) => console.error(e)
    );

    useEffect(() => () => unsubscribe(), [unsubscribe]);

    return { quizzes, isLoading };
}

export function useCreateQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function createQuiz(params: { name: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const quizData: Omit<RawQuizzes[string], 'totalFacts'> = {
            ...params,
            ownerId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await push(ref(getDatabase(), `quizzes`), quizData);
        setIsLoading(false);
    }

    return { createQuiz, isLoading };
}

export function useEditQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function editQuiz(params: { id: string; name: string }) {
        setIsLoading(true);

        const quizData: Partial<RawQuizzes[string]> = {
            name: params.name,
            updatedAt: new Date().toISOString(),
        };

        await update(ref(getDatabase(), `quizzes/${params.id}`), quizData);
        setIsLoading(false);
    }

    return { editQuiz, isLoading };
}

export function useDeleteQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function deleteQuiz(id: string) {
        setIsLoading(true);
        await remove(ref(getDatabase(), `quizzes/${id}`));
        setIsLoading(false);
    }

    return { deleteQuiz, isLoading };
}
