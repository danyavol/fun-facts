/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onValueWritten } from 'firebase-functions/v2/database';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const updateTotalFacts = onValueWritten({ ref: '/facts/{factId}', region: 'europe-west1' }, async ({ data }) => {
    const differences: { quizId: number; difference: number }[] = [];

    // Find which quiz exactly was changed
    if (!data.before.exists() && data.after.exists()) {
        // New fact was created
        differences.push({
            quizId: data.after.val().quizId,
            difference: 1,
        });
    } else if (data.before.exists() && !data.after.exists()) {
        // Fact was deleted
        differences.push({
            quizId: data.before.val().quizId,
            difference: -1,
        });
    } else if (data.before.val().quizId !== data.after.val().quizId) {
        // Quiz ID has changed
        differences.push({
            quizId: data.before.val().quizId,
            difference: -1,
        });

        differences.push({
            quizId: data.after.val().quizId,
            difference: 1,
        });
    } else return;

    await Promise.all(
        differences.map(async ({ quizId, difference }) => {
            const quizRef = getFirestore().doc(`/quizzes/${quizId}`);
            const currentValue = ((await quizRef.get()).data()?.['totalFacts'] as number) ?? 0;
            const newValue = currentValue + difference;

            await quizRef.set({ totalFacts: newValue < 0 ? 0 : newValue });
        })
    );
});
