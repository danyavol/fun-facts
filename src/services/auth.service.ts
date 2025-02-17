import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    User,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            setUser(user);
            if (user) {
                user.getIdTokenResult().then((data) => {
                    setIsAdmin(!!data.claims.admin);
                });
            } else {
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, isAdmin, isLoading };
}

export function useSignInViaGoogle() {
    const [isLoading, setIsLoading] = useState(false);

    async function signInViaGoogle() {
        setIsLoading(true);
        await signInWithPopup(getAuth(), new GoogleAuthProvider());
        setIsLoading(false);
    }

    return { signInViaGoogle, isLoading };
}

export function useSignInAnonymously() {
    const [isLoading, setIsLoading] = useState(false);

    async function signInAnonymous() {
        setIsLoading(true);
        await signInAnonymously(getAuth());
        setIsLoading(false);
    }

    return { signInAnonymous, isLoading };
}

export function useSignOut() {
    const [isLoading, setIsLoading] = useState(false);

    async function signOut() {
        setIsLoading(true);
        await getAuth().signOut();
        setIsLoading(false);
    }

    return { signOut, isLoading };
}
