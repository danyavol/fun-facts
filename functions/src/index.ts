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
        const querySnapshot = await factsRef.where('quizId', '==', quizId).get();
        querySnapshot.forEach((doc) => {
            const imageUrl = doc.get('imageUrl') as null | string;
            if (imageUrl) getStorage().bucket().file(`fact-image/${imageUrl}`).delete();
            doc.ref.delete();
        });
    }
);

export const populateTotalFacts = onDocumentCreated(
    { document: '/quizzes/{quizId}', region: 'europe-central2' },
    async ({ document }) => {
        const quizRef = getFirestore().doc(document);
        await quizRef.update({ totalFacts: 0 });
    }
);
