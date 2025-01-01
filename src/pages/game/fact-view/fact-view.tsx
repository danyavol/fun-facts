import { Game, Player, tempEndQuiz } from '../../../services/game.service.ts';
import { useCurrentUser } from '../../../services/auth.service.ts';
import { Button } from '@radix-ui/themes';

type FactViewProps = {
    game: Game;
    players: Player[];
    me: Player;
};

export function FactView(props: FactViewProps) {
    const { isAdmin } = useCurrentUser();
    return (
        <Button onClick={() => tempEndQuiz(props.game)} disabled={!isAdmin}>
            Back
        </Button>
    );
}
