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
    Timestamp,
    where,
    documentId,
} from 'firebase/firestore';
import { Badge } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.service.ts';
import { useCurrentUserProfile, useEditUserProfile } from './user-profile.service.ts';

export type Quiz = {
    id: string;
    name: string;
    answers: string[];
    ownerId: string;
    totalFacts?: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: 'open' | 'started' | 'ended';
};

export function getStatusName(status: Quiz['status']) {
    switch (status) {
        case 'open':
            return (
                <Badge color="amber" size="2" variant="solid">
                    Подготовка
                </Badge>
            );
        case 'started':
            return (
                <Badge color="green" size="2" variant="solid">
                    Квиз начался!
                </Badge>
            );
        case 'ended':
            return (
                <Badge color="red" size="2" variant="solid">
                    Квиз окончен
                </Badge>
            );
        default:
            return status;
    }
}

export function useQuizzesList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { userProfile } = useCurrentUserProfile();

    useEffect(() => {
        if (!userProfile) return;
        if (!userProfile.quizzes.length) {
            setIsLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            query(
                collection(getFirestore(), `quizzes`),
                where(documentId(), 'in', userProfile.quizzes),
                orderBy('createdAt', 'desc')
            ),
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
    }, [userProfile]);

    return { quizzes, isLoading };
}

export function useQuiz(quizId: string) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { editUserProfile } = useEditUserProfile();
    const { userProfile } = useCurrentUserProfile();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(getFirestore(), `quizzes/${quizId}`),
            (snapshot) => {
                setQuiz(
                    snapshot.exists()
                        ? ({
                              id: snapshot.id,
                              ...snapshot.data(),
                          } as Quiz)
                        : null
                );
                setIsLoading(false);
            },
            (e) => {
                console.error(e);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [quizId]);

    useEffect(() => {
        if (userProfile) {
            const quizzes = new Set(userProfile.quizzes);
            quizzes.add(quizId);

            editUserProfile({ quizzes: Array.from(quizzes) });
        }
    }, [userProfile, editUserProfile, quizId]);

    return { quiz, isLoading };
}

export function useCreateQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // TODO: Save quiz in userProfile once created

    async function createQuiz(params: { name: string; answers: string[] }) {
        setIsLoading(true);
        const user = await getCurrentUser();

        try {
            if (!user) throw new Error('Unauthorized');

            const quizData: Omit<Quiz, 'totalFacts' | 'id'> = {
                ...params,
                ownerId: user.uid,
                status: 'open',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            await addDoc(collection(getFirestore(), `quizzes`), quizData);
        } finally {
            setIsLoading(false);
        }
    }

    return { createQuiz, isLoading };
}

export function useEditQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function editQuiz(params: Partial<Pick<Quiz, 'id' | 'name' | 'answers' | 'status'>>) {
        setIsLoading(true);

        const paramsWithoutId = { ...params };
        delete paramsWithoutId.id;

        const quizData: Partial<Omit<Quiz, 'totalFacts' | 'id'>> = {
            ...paramsWithoutId,
            updatedAt: Timestamp.now(),
        };

        try {
            await updateDoc(doc(getFirestore(), `quizzes/${params.id}`), quizData);
        } finally {
            setIsLoading(false);
        }
    }

    return { editQuiz, isLoading };
}

export function useDeleteQuiz() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function deleteQuiz(id: string) {
        setIsLoading(true);
        try {
            await deleteDoc(doc(getFirestore(), `quizzes/${id}`));
        } finally {
            setIsLoading(false);
        }
    }

    return { deleteQuiz, isLoading };
}
