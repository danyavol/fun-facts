import { getAuth, onAuthStateChanged, signInAnonymously, User, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';

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

export async function signInViaGoogle() {
    const provider = new GoogleAuthProvider();

    const user = await getCurrentUser();
    await linkWithPopup(user, provider);
}
