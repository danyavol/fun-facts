import { Badge } from '@radix-ui/themes';
import styles from './me.module.scss';

type MeProps = {
    type: 'inverse' | 'normal' | 'gray';
};

export function Me({ type = 'normal' }: MeProps) {
    return (
        <Badge className={`${styles.wrapper} ${styles[type]}`} size="1" variant="outline">
            Я
        </Badge>
    );
}
