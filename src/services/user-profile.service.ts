import { useEffect, useState } from 'react';
import { doc, getFirestore, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { getCurrentUser, useCurrentUser } from './auth.service';

export type UserProfile = {
    id: string;
} & UserProfileRaw;

type UserProfileRaw = {
    quizzes: string[];
};

const getProfileLink = (userId: string) => `user-profiles/${userId}`;

export function useCurrentUserProfile() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { user } = useCurrentUser();

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(
            doc(getFirestore(), getProfileLink(user.uid)),
            (snapshot) => {
                if (!snapshot.exists()) {
                    // guests doesn't have profile by default
                    setDoc(doc(getFirestore(), getProfileLink(user.uid)), { quizzes: [] });
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

export async function joinQuiz(quizId: string) {
    const user = await getCurrentUser();
    if (!user) throw Error('Must not be called for unauthorized user');

    const profile = await getDoc(doc(getFirestore(), getProfileLink(user.uid)));
    const data = profile.data() as UserProfileRaw;

    const quizzesSet = new Set(data.quizzes);
    if (quizzesSet.has(quizId)) return;

    quizzesSet.add(quizId);
    await setDoc(doc(getFirestore(), getProfileLink(user.uid)), { quizzes: Array.from(quizzesSet) });
}
