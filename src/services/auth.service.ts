import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    User,
    GoogleAuthProvider,
    signInWithPopup,
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
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const auth = getAuth();
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoading(false);
                setUser(user);
                user.getIdTokenResult().then((data) => {
                    setIsAdmin(!!data.claims.admin);
                });
            } else {
                signInAnonymously(auth).then(() => {});
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, isAdmin, isLoading };
}

export async function signInViaGoogle() {
    await signInWithPopup(getAuth(), new GoogleAuthProvider());
}

export async function signInAnonymous() {
    await signInAnonymously(getAuth());
}

export async function signOut() {
    await getAuth().signOut();
}
