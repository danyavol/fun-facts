import type { Fact } from './facts.service';
import { doc, getFirestore, Timestamp, onSnapshot, collection } from 'firebase/firestore';
import { useCurrentUser } from './auth.service.ts';
import { useEffect, useState } from 'react';


export type AnswerId = string; // equals to the index of Game.answers array
export type FactId = string; // equals to the index of Game.facts array

export type Player = {
    id: string; // equals to AnswerId
    userId: string;
    givenAnswers: { [factId: FactId]: AnswerId };
}

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
}

/**
 * ~game-registration~    if (!displayedFact && status === "play") || !registeredUsers.values().includes(auth.uid)
 * ~next-fact-countdown~  if displayedFact && now < displayedFact.start
 * ~fact-view~            if displayedFact || now >= displayedFact.start
 * ~game-result~          if (!displayedFact && status === "ended")
 * */

export function useGame(gameId: string) {
    const [game, setGame] = useState<Game | null>(null);

    useEffect(() => onSnapshot(
        doc(getFirestore(), `/games/${gameId}`),
        (snapshot) => {
            setGame(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as Game : null);
        },
        (e) => console.error(e)
    ), [gameId]);

    return game;
}

export function useGamePlayers(gameId: string) {
    const { user } = useCurrentUser();
    const [players, setPlayers] = useState<Player[]>([]);
    const [me, setMe] = useState<Player | null>(null);

    useEffect(() => {
        if (!user) return;
        return onSnapshot(
            collection(getFirestore(), `/games/${gameId}/players`),
            ({ docs }) => {
                const me = docs.find(doc => doc.data().userId === user.uid);
                setMe(me ? ({ ...me.data(), id: me.id} as Player) : null);
                setPlayers(docs.map(doc => ({ ...doc.data(), id: doc.id} as Player)));
            },
            (e) => console.error(e)
        );
    }, [user, gameId]);

    return { me, players };
}