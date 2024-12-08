import './App.css';
import { getDatabase, push, ref } from 'firebase/database';
import { Button } from '@radix-ui/themes';
import { getCurrentUser } from './services/auth.service.ts';

function App() {
    async function saveData() {
        const db = getDatabase();
        const user = await getCurrentUser();
        return push(ref(db, 'facts'), {
            fact: 'I was born in 21 century',
            userId: user.uid,
        });
    }

    return (
        <>
            <div>
                <Button onClick={saveData}>Click me</Button>
            </div>
        </>
    );
}

export default App;
