import { Badge } from '@radix-ui/themes';
import styles from './me.module.scss';
import { useTranslate } from '../../translate/use-translate.ts';

type MeProps = {
    type: 'inverse' | 'normal' | 'gray';
};

export function Me({ type = 'normal' }: MeProps) {
    const { t } = useTranslate();
    return (
        <Badge className={`${styles.wrapper} ${styles[type]}`} size="1" variant="outline">
            {t('game.me')}
        </Badge>
    );
}
