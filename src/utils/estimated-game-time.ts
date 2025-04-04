const minimumSecondsForQuestion = 60 * 2.5;
const maximumSecondsForQuestion = 60 * 4;

export function getEstimatedGameTime(numberOfPlayers: number, factsLimit: number): string {
    const totalFacts = numberOfPlayers * factsLimit;

    const minimumMinutes = roundToNearestFive((minimumSecondsForQuestion / 60) * totalFacts);
    const maximumMinutes = roundToNearestFive((maximumSecondsForQuestion / 60) * totalFacts);

    if (minimumMinutes === maximumMinutes) return `${maximumMinutes}`;

    return `${minimumMinutes} - ${maximumMinutes}`;
}

function roundToNearestFive(num: number): number {
    const minimumValue = 5;
    return Math.max(Math.round(num / 5) * 5, minimumValue);
}
