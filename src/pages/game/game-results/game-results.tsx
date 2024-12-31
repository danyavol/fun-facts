import { Game, Player } from '../../../services/game.service.ts';

type GameResultsProps = {
    game: Game;
    players: Player[];
    me: Player | null;
};

export function GameResults(props: GameResultsProps) {
    return null;
}
