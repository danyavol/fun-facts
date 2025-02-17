import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useCurrentUser } from '../services/auth.service.ts';
import { Spinner } from '@radix-ui/themes';

export const UnAuthGuard = ({ component }: { component: () => ReactElement }) => {
    const location = useLocation();
    const { user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="global-spinner-container">
                <Spinner />
            </div>
        );
    } else if (!user) {
        return component();
    } else {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
};
