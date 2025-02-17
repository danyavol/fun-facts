import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useCurrentUser } from '../services/auth.service.ts';
import { User } from 'firebase/auth';
import { Spinner } from '@radix-ui/themes';

export const AuthGuard = ({ component }: { component: (user: User, isAdmin: boolean) => ReactElement }) => {
    const location = useLocation();
    const { user, isLoading, isAdmin } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="global-spinner-container">
                <Spinner />
            </div>
        );
    } else if (user) {
        return component(user, isAdmin);
    } else {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
};
