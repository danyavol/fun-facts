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

type Fact = {
    id: string;
    quizId: string;
    ownerId: string;
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
                    console.log(88);
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
    }, []);

    return { facts, isLoading };
}

export function useCreateFact() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function createFact(params: { text: string; quizId: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const factData: Omit<Fact, 'id'> = {
            ...params,
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

    async function editFact(params: { id: string; text: string }) {
        setIsLoading(true);

        const factData: Partial<Fact> = {
            text: params.text,
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
