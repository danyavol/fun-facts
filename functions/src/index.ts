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

export const updateTotalFacts = onValueWritten({ ref: '/facts/{factId}', region: 'europe-west1' }, async ({ data }) => {
    // Ignore edits
    if (data.after.exists() && data.before.exists()) return;

    const factsRef = getDatabase().ref('/facts');
    const totalFactsRef = getDatabase().ref('/totalFacts');

    const totalFacts = (await factsRef.get()).numChildren();

    await totalFactsRef.set(totalFacts);
});
