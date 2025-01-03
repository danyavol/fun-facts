import type { Fact } from './facts.service';
import {
    doc,
    getFirestore,
    Timestamp,
    onSnapshot,
    collection,
    updateDoc,
    setDoc,
    deleteField,
    query,
    where,
} from 'firebase/firestore';
import { getCurrentUser, useCurrentUser } from './auth.service.ts';
import { useEffect, useState } from 'react';
import { getRealTimeOffset } from '../utils/time-sync.ts';

export type AnswerId = string; // equals to the index of Game.answers array
export type FactId = string; // equals to the index of Game.facts array

export type Player = {
    id: string; // equals to AnswerId
    userId: string | null;
    givenAnswers: { [factId: FactId]: AnswerId };
};

export type Game = {
    id: string; // equals to related QuizId
    // Immutable list of players (copy of quiz.answers)
    answers: string[];
    // Immutable list of all facts shuffled (text and imageUrl only)
    facts: Pick<Fact, 'text' | 'imageUrl'>[];
    displayedFact: {
        id: FactId;
        start: Timestamp; // when fact is displayed on the screen and answers are allowed
        end: Timestamp; // when answers are no longer accepted
    } | null;
    correctAnswers: { [factId: FactId]: AnswerId };
    status: 'started' | 'ended';
    ownerId: string;
};

export function useGame(gameId: string) {
    const [game, setGame] = useState<Game | null>(null);

    useEffect(
        () =>
            onSnapshot(
                doc(getFirestore(), `/games/${gameId}`),
                (snapshot) => {
                    setGame(snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as Game) : null);
                },
                (e) => console.error(e)
            ),
        [gameId]
    );

    return game;
}

export function useGamePlayers(gameId: string) {
    const { user } = useCurrentUser();
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [me, setMe] = useState<Player | null>(null);

    useEffect(() => {
        if (!user) return;
        return onSnapshot(
            query(collection(getFirestore(), `/games/${gameId}/players`), where('userId', '!=', null)),
            ({ docs }) => {
                const me = docs.find((doc) => doc.data().userId === user.uid);
                setMe(me ? ({ ...me.data(), id: me.id } as Player) : null);
                setPlayers(docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Player));
            },
            (e) => console.error(e)
        );
    }, [user, gameId]);

    return { me, players };
}

export function useGamePlayerSelection(gameId: string) {
    async function selectPlayer(playerId: string, me: Player | null) {
        if (me?.userId) await deselectPlayer(me.id);
        const user = await getCurrentUser();
        // TODO: Fails when givenAnswers is not empty in firestore
        await setDoc(
            doc(getFirestore(), `/games/${gameId}/players/${playerId}`),
            {
                userId: user.uid,
                givenAnswers: {},
            } as Omit<Player, 'id'>,
            { merge: true }
        );
    }

    async function deselectPlayer(playerId: string) {
        await updateDoc(doc(getFirestore(), `/games/${gameId}/players/${playerId}`), {
            userId: null,
        } as Partial<Player>);
    }

    return { selectPlayer, deselectPlayer };
}

function getNextFactDates() {
    const startTimeoutSeconds = 3;
    const secondsToAnswer = 45;
    const now = Date.now() + getRealTimeOffset();

    return {
        start: Timestamp.fromDate(new Date(now + startTimeoutSeconds * 1000)),
        end: Timestamp.fromDate(new Date(now + startTimeoutSeconds * 1000 + secondsToAnswer * 1000)),
    };
}

export async function startQuiz(game: Game) {
    await updateDoc(doc(getFirestore(), `/games/${game.id}`), {
        displayedFact: {
            id: '0',
            ...getNextFactDates(),
        },
    } as Partial<Game>);
}

export async function tempEndQuiz(game: Game) {
    await updateDoc(doc(getFirestore(), `/games/${game.id}`), {
        displayedFact: null,
    } as Partial<Game>);
}

export async function voteForFact(gameId: string, playerId: string, factId: string, answerId: string) {
    console.log('1', playerId, `givenAnswers.${factId}`);
    await updateDoc(doc(getFirestore(), `/games/${gameId}/players/${playerId}`), {
        [`givenAnswers.${factId}`]: answerId,
    });
}

export async function revokeVote(gameId: string, playerId: string, factId: string) {
    console.log('2', playerId, `givenAnswers.${factId}`);
    await updateDoc(doc(getFirestore(), `/games/${gameId}/players/${playerId}`), {
        [`givenAnswers.${factId}`]: deleteField(),
    });
}
