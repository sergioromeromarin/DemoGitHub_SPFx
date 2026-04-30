import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from 'store/useAppStore';
import { Paths } from 'utils/Constants';

const DefaultRedirect: React.FC = () => {
    const { isAdmin, isUser, isLoading } = useAppStore();

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!isAdmin && !isUser) {
        return <Navigate to={Paths.NoAccess} replace />;
    }

     if (isUser) {
        return <Navigate to={Paths.Tasks_MyPendingTasks} replace />;
    }

    if (isAdmin) {
        return <Navigate to={Paths.Administration} replace />;
    }

    return <Navigate to={Paths.Planning} replace />;
};

export default DefaultRedirect;