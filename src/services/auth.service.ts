import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
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
    const [error, setError] = useState('');

    async function signInViaGoogle() {
        setIsLoading(true);
        setError('');
        try {
            await signInWithPopup(getAuth(), new GoogleAuthProvider());
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setIsLoading(false);
        }
    }

    return { signInViaGoogle, isLoading, error };
}

export function useSignInAnonymously() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function signInAnonymous() {
        setIsLoading(true);
        setError('');
        try {
            await signInAnonymously(getAuth());
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setIsLoading(false);
        }
    }

    return { signInAnonymous, isLoading, error };
}

export function useSignInWithPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function signInWithPassword(email: string, password: string) {
        setIsLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setIsLoading(false);
        }
    }

    return { signInWithPassword, isLoading, error };
}

export function useCreateNewPasswordAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function createNewPasswordAccount(email: string, password: string) {
        setIsLoading(true);
        setError('');
        try {
            await createUserWithEmailAndPassword(getAuth(), email, password);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setIsLoading(false);
        }
    }

    return { createNewPasswordAccount, isLoading, error };
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

function getErrorMessage(error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Неверный адрес эл. почты';
            case 'auth/invalid-credential':
                return 'Неверная эл. почта или пароль';
            case 'auth/weak-password':
                return 'Слишком слабый пароль';
            default:
                return error.code;
        }
    } else {
        return 'Произошла неизвестная ошибка';
    }
}
