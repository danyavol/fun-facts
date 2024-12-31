import { Game, Player } from '../../../services/game.service.ts';

type FactViewProps = {
    game: Game;
    players: Player[];
    me: Player;
};

export function FactView(props: FactViewProps) {
    return null;
}
