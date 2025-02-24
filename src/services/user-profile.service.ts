import { useEffect, useState } from 'react';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { useCurrentUser } from './auth.service';

export type UserProfile = {
    id: string;
    quizzes: string[];
};

export function useCurrentUserProfile() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { user } = useCurrentUser();

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(
            doc(getFirestore(), `user-profiles/${user.uid}`),
            (snapshot) => {
                if (!snapshot.exists()) {
                    // guests doesn't have profile by default
                    setDoc(doc(getFirestore(), `user-profiles/${user.uid}`), { quizzes: [] });
                    return;
                }
                setUserProfile({
                    id: snapshot.id,
                    ...snapshot.data(),
                } as UserProfile);
            },
            (e) => {
                console.error(e);
            }
        );

        return () => unsubscribe();
    }, [user]);

    return { userProfile };
}

export function useEditUserProfile() {
    const { user } = useCurrentUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function editUserProfile(params: Partial<Omit<UserProfile, 'id'>>) {
        if (!user) return;

        setIsLoading(true);
        try {
            await setDoc(doc(getFirestore(), `user-profiles/${user.uid}`), params, { merge: true });
        } finally {
            setIsLoading(false);
        }
    }

    return { editUserProfile, isLoading };
}
