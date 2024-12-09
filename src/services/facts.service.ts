import { getDatabase, onValue, push, ref, update, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.service.ts';

type RawFact = {
    quizId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
};

type RawFacts = {
    [factId: string]: RawFact;
};

export type Fact = RawFact & {
    id: string;
};

export function useQuizFacts(quizId: string) {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    let unsubscribe = () => {};

    (async () => {
        const user = await getCurrentUser();
        unsubscribe = onValue(
            ref(getDatabase(), `facts/${user.uid}`),
            (snapshot) => {
                const rawData = snapshot.val() as RawFacts | null;
                const data = Object.entries(rawData ?? {})
                    .filter(([_, fact]) => fact.quizId === quizId)
                    .map(
                        ([key, value]): Fact => ({
                            id: key,
                            ...value,
                        })
                    );
                setFacts(data);
                if (isLoading) setIsLoading(false);
            },
            (e) => console.error(e)
        );
    })();

    useEffect(() => () => unsubscribe(), []);

    return { facts, isLoading };
}

export function useCreateFact() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function createFact(params: { text: string; quizId: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const factData: RawFact = {
            ...params,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await push(ref(getDatabase(), `facts/${user.uid}`), factData);
        setIsLoading(false);
    }

    return { createFact, isLoading };
}

export function useEditFact() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function editFact(params: { id: string; text: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const factData: Partial<RawFact> = {
            text: params.text,
            updatedAt: new Date().toISOString(),
        };

        await update(ref(getDatabase(), `facts/${user.uid}/${params.id}`), factData);
        setIsLoading(false);
    }

    return { editFact, isLoading };
}

export function useDeleteFact() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function deleteFact(id: string) {
        setIsLoading(true);
        const user = await getCurrentUser();
        await remove(ref(getDatabase(), `facts/${user.uid}/${id}`));
        setIsLoading(false);
    }

    return { deleteFact, isLoading };
}
