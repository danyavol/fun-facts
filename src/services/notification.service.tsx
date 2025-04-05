import { Toast } from 'radix-ui';
import { createContext, useState, useContext, useCallback, ReactNode } from 'react';

type Toast = {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
};

type ToastType = 'error';

type ShowToastFn = (message: string, type: ToastType, duration?: number) => void;

// Create Context
const NotificationContext = createContext({ toasts: [] as Toast[], addToast: (() => {}) as ShowToastFn });

// This will store the function for adding toasts
let addToastGlobal: ShowToastFn = () => {};

// Notification Service class that manages toasts
export const NotificationService: {
    showToast: ShowToastFn;
} = {
    showToast: (message: string, type: ToastType = 'error', duration = 3000) => {
        addToastGlobal(message, type, duration);
    },
};

// Provider to wrap your app and provide access to the notification system
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback<ShowToastFn>((message, type = 'error', duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

        // Automatically remove the toast after the specified duration
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
    }, []);

    // Store the addToast function globally
    addToastGlobal = addToast;

    return (
        <Toast.Provider>
            <NotificationContext.Provider value={{ toasts, addToast }}>{children}</NotificationContext.Provider>
        </Toast.Provider>
    );
};

// Custom hook to use notifications inside React components
export const useNotification = () => {
    return useContext(NotificationContext);
};
