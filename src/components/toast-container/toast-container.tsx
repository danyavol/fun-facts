import { useNotification } from '../../services/notification.service.tsx';
import * as Toast from '@radix-ui/react-toast';
import { Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import styles from './toast-container.module.scss';
import { ToastViewport } from '@radix-ui/react-toast';

export const ToastContainer = () => {
    const { toasts } = useNotification();
    // TODO: Support more customization
    return (
        <>
            <ToastViewport className={styles.toast} />
            {toasts.map((toast) => (
                <Toast.Root type="background" key={toast.id}>
                    <Callout.Root color="red" style={{ backgroundColor: 'var(--red-3)' }}>
                        <Callout.Icon>
                            <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>{toast.message}</Callout.Text>
                    </Callout.Root>
                </Toast.Root>
            ))}
        </>
    );
};
