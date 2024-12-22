import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    getFirestore,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.service.ts';

type Quiz = {
    id: string;
    name: string;
    ownerId: string;
    totalFacts?: number;
    createdAt: string;
    updatedAt: string;
};

export function useQuizzesList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(getFirestore(), `quizzes`), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setQuizzes(
                    snapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                ...doc.data(),
                            }) as Quiz
                    )
                );
                setIsLoading(false);
            },
            (e) => {
                console.error(e);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { quizzes, isLoading };
}

export function useQuiz(quizId: string) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(getFirestore(), `quizzes/${quizId}`),
            (snapshot) => {
                setQuiz({
                    id: snapshot.id,
                    ...snapshot.data(),
                } as Quiz);
                setIsLoading(false);
            },
            (e) => {
                console.error(e);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [quizId]);

    return { quiz, isLoading };
}

export function useCreateQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function createQuiz(params: { name: string }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        const quizData: Omit<Quiz, 'totalFacts' | 'id'> = {
            ...params,
            ownerId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await addDoc(collection(getFirestore(), `quizzes`), quizData);
        } finally {
            setIsLoading(false);
        }
    }

    return { createQuiz, isLoading };
}

export function useEditQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function editQuiz(params: { id: string; name: string }) {
        setIsLoading(true);

        const quizData: Partial<Omit<Quiz, 'totalFacts' | 'id'>> = {
            name: params.name,
            updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(getFirestore(), `quizzes/${params.id}`), quizData);
        setIsLoading(false);
    }

    return { editQuiz, isLoading };
}

export function useDeleteQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function deleteQuiz(id: string) {
        setIsLoading(true);
        await deleteDoc(doc(getFirestore(), `quizzes/${id}`));
        setIsLoading(false);
    }

    return { deleteQuiz, isLoading };
}