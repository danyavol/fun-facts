import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    User,
    GoogleAuthProvider,
    linkWithPopup,
    signInWithCredential,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export function getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe();
                resolve(user);
            } else {
                signInAnonymously(auth).catch(reject);
            }
        });
    });
}

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                signInAnonymously(auth).then(() => {});
            }
        });

        return () => unsubscribe();
    }, []);

    return user;
}

export async function signInViaGoogle() {
    const provider = new GoogleAuthProvider();

    const user = await getCurrentUser();

    await linkWithPopup(user, provider).catch(async ({ customData: { _tokenResponse }, code }) => {
        console.error('Account already exists');
        if (code === 'auth/credential-already-in-use') {
            // TODO: Fix it
            await signInWithCredential(getAuth(), _tokenResponse);
        }
    });
}
