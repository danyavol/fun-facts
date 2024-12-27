import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    getFirestore,
    updateDoc,
    deleteDoc,
    query,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.service.ts';

export type Fact = {
    id: string;
    quizId: string;
    ownerId: string;
    imageUrl: string | null;
    text: string;
    createdAt: string;
    updatedAt: string;
};

export function useQuizFacts(quizId: string) {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let unsubscribe = () => {};

        (async () => {
            const user = await getCurrentUser();
            unsubscribe = onSnapshot(
                query(
                    collection(getFirestore(), `facts`),
                    where('ownerId', '==', user.uid),
                    where('quizId', '==', quizId)
                ),
                (snapshot) => {
                    setFacts(
                        snapshot.docs.map(
                            (doc) =>
                                ({
                                    id: doc.id,
                                    ...doc.data(),
                                }) as Fact
                        )
                    );
                    setIsLoading(false);
                },
                (e) => console.error(e)
            );
        })();

        return unsubscribe;
    }, [quizId]);

    return { facts, isLoading };
}

export function useCreateFact() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function createFact(params: { text: string; quizId: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const factData: Omit<Fact, 'id'> = {
            ...params,
            imageUrl: null,
            ownerId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addDoc(collection(getFirestore(), `facts`), factData);
        setIsLoading(false);
    }

    return { createFact, isLoading };
}

export function useEditFact() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function editFact(params: Partial<Pick<Fact, 'id' | 'text' | 'imageUrl'>>) {
        setIsLoading(true);

        const paramsWithoutId = { ...params };
        delete paramsWithoutId.id;

        const factData: Partial<Fact> = {
            ...paramsWithoutId,
            updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(getFirestore(), `facts/${params.id}`), factData);
        setIsLoading(false);
    }

    return { editFact, isLoading };
}

export function useDeleteFact() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function deleteFact(id: string) {
        setIsLoading(true);
        await deleteDoc(doc(getFirestore(), `facts/${id}`));
        setIsLoading(false);
    }

    return { deleteFact, isLoading };
}
