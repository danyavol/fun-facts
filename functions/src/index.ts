/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentWritten, onDocumentDeleted, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getStorage } from 'firebase-admin/storage';

initializeApp();

export const updateTotalFacts = onDocumentWritten(
    { document: '/facts/{factId}', region: 'europe-central2' },
    async ({ data }) => {
        const differences: { quizId: number; difference: number }[] = [];

        // Find which quiz exactly was changed
        if (!data?.before.exists && data?.after.exists) {
            // New fact was created
            differences.push({
                quizId: data.after.data()?.quizId,
                difference: 1,
            });
        } else if (data?.before.exists && !data?.after.exists) {
            // Fact was deleted
            differences.push({
                quizId: data.before.data()?.quizId,
                difference: -1,
            });
        } else if (data?.before.data()?.quizId !== data?.after.data()?.quizId) {
            // Quiz ID has changed
            differences.push({
                quizId: data?.before.data()?.quizId,
                difference: -1,
            });

            differences.push({
                quizId: data?.after.data()?.quizId,
                difference: 1,
            });
        } else return;

        await Promise.all(
            differences.map(async ({ quizId, difference }) => {
                if (!quizId) return;

                const quizRef = getFirestore().doc(`/quizzes/${quizId}`);
                const currentValue = ((await quizRef.get()).data()?.['totalFacts'] as number) ?? 0;
                const newValue = currentValue + difference;

                await quizRef.update({ totalFacts: newValue < 0 ? 0 : newValue });
            })
        );
    }
);

export const deleteQuizFacts = onDocumentDeleted(
    { document: '/quizzes/{quizId}', region: 'europe-central2' },
    async ({ params: { quizId } }) => {
        const factsRef = getFirestore().collection('/facts');

        // Delete all facts where quizId matches the deleted quiz
        const factsToDelete = await factsRef.where('quizId', '==', quizId).get();
        await Promise.all(
            factsToDelete.docs.map(async (fact) => {
                try {
                    // Try to delete fact image. It's fine if there is no image and it throws an error
                    await getStorage().bucket().file(`fact-image/${fact.id}`).delete();
                } finally {
                    await fact.ref.delete();
                }
            })
        );
    }
);

export const populateTotalFacts = onDocumentCreated(
    { document: '/quizzes/{quizId}', region: 'europe-central2' },
    async ({ document }) => {
        const quizRef = getFirestore().doc(document);
        await quizRef.update({ totalFacts: 0 });
    }
);

export const createGame = onDocumentWritten(
    { document: '/quizzes/{quizId}', region: 'europe-central2' },
    async ({ data, params: { quizId } }) => {
        const after = data?.after.data();
        const before = data?.before.data();
        if (!after || !before) return;

        if (after.status !== before.status && after.status === 'started') {
            await createNewGame(quizId, after);
        }
    }
);

async function createNewGame(quizId: string, quizData: FirebaseFirestore.DocumentData) {
    const quizFacts = await getFirestore().collection('/facts').where('quizId', '==', quizId).get();
    const mappedFacts = quizFacts.docs.map((fact) => ({ text: fact.data().text, imageUrl: fact.data().imageUrl }));
    shuffleArray(mappedFacts);

    const gameRef = getFirestore().doc(`/games/${quizId}`);
    await gameRef.set({
        answers: quizData.answers,
        correctAnswers: {},
        facts: mappedFacts,
        displayedFact: null,
        ownerId: quizData.ownerId,
        status: 'started',
    });

    const batch = getFirestore().batch();
    const oldPlayers = await getFirestore().collection(`/games/${quizId}/players`).get();
    oldPlayers.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}

function shuffleArray<T>(array: T[]): void {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}
