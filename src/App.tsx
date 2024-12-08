import './App.css';
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { Button } from '@radix-ui/themes';
import { getCurrentUser, signInViaGoogle } from './services/auth.service.ts';
import { useEffect, useState } from 'react';

function App() {
    const [facts, setFacts] = useState<any[]>([]);
    const [totalFacts, setTotalFacts] = useState<number>(0);
    const quizId = 1;

    async function saveData() {
        const user = await getCurrentUser();
        return push(ref(getDatabase(), `facts/${user.uid}`), {
            text: 'I was born in 21 century',
            quizId: quizId,
            createdAt: new Date().toISOString(),
        });
    }

    useEffect(() => {
        let unsubscribe1 = () => {};

        (async () => {
            const user = await getCurrentUser();
            unsubscribe1 = onValue(
                ref(getDatabase(), `facts/${user.uid}`),
                (snapshot) => {
                    const data = Object.entries(snapshot.val() ?? {}).map(([key, value]) => ({
                        id: key,
                        ...(value as object),
                    }));
                    setFacts(data);
                },
                (e) => console.log('error', e)
            );
        })();

        const unsubscribe2 = onValue(
            ref(getDatabase(), `totalFacts/${quizId}`),
            (snapshot) => setTotalFacts(snapshot.val() ?? 0),
            (e) => console.log('error', e)
        );

        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    }, []);

    async function googleSignIn() {
        await signInViaGoogle();
    }

    return (
        <>
            <div>
                <Button onClick={saveData}>Click me</Button>
            </div>
            Facts ({totalFacts}):
            {facts.map((fact, index) => (
                <div key={fact.id}>
                    {index + 1}) {fact.text}
                </div>
            ))}
            <div>
                <Button onClick={googleSignIn}>Sign in via google</Button>
            </div>
        </>
    );
}

export default App;
