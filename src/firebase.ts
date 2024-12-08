import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyAfh_tIRBkfM3z6XNY79OntXGhETLa5xSI',
    authDomain: 'fun-facts-2fa6e.firebaseapp.com',
    databaseURL: 'https://fun-facts-2fa6e-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'fun-facts-2fa6e',
    storageBucket: 'fun-facts-2fa6e.firebasestorage.app',
    messagingSenderId: '1079857081515',
    appId: '1:1079857081515:web:5b11186d487e89ef6b5bee',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

getAuth(app);

getDatabase(app);
