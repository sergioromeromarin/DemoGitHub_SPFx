import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from 'store/useAppStore';
import { Roles } from 'utils/Constants';

interface IProtectedRouteProps {
    requiredRole?: Roles.user | Roles.admin | Roles.taskUser;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isUser, isAdmin, isTaskUser,  isLoading: loading } = useAppStore();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isUser && !isAdmin && !isTaskUser) {
        return <Navigate to="/no-access" replace />;
    }

    if (requiredRole === Roles.admin && !isAdmin) {
        return <Navigate to="/no-access" replace />;
    }

    if (requiredRole === Roles.user && !isUser) {
        return <Navigate to="/no-access" replace />;
    }

      if (requiredRole === Roles.taskUser && !isTaskUser) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{children}</>;
};



export default ProtectedRoute;