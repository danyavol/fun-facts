import { getAuth, onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

export function getCurrentUser(): Promise<User> {
    console.log('start', new Date().getTime());
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe();
                console.log('end', new Date().getTime());
                resolve(user);
            } else {
                signInAnonymously(auth).catch(reject);
            }
        });
    });
}
