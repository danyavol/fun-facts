/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onValueWritten } from 'firebase-functions/v2/database';
import { getDatabase } from 'firebase-admin/database';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export const updateTotalFacts = onValueWritten(
    { ref: '/facts/{userId}/{factId}', region: 'europe-west1' },
    async ({ data }) => {
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
                const totalFactsRef = getDatabase().ref(`/quizzes/${quizId}/totalFacts`);
                const currentValue = (await totalFactsRef.get()).val() ?? 0;
                const newValue = currentValue + difference;

                await totalFactsRef.set(newValue < 0 ? 0 : newValue);
            })
        );
    }
);
