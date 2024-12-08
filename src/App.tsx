import './App.css'
import { getDatabase, push, ref } from 'firebase/database'
import { Button } from '@radix-ui/themes'

function App() {
    function saveData() {
        const db = getDatabase()
        return push(ref(db, 'facts'), {
            fact: 'I was born in 21 century',
        })
    }

    return (
        <>
            <div>
                <Button onClick={saveData}>Click me</Button>
            </div>
        </>
    )
}

export default App
