import * as React from 'react';
import styles from './Admin.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPlanning from '../../pages/AdminPlanning/AdminPlanning';
import { Toaster } from 'react-hot-toast';
import { Paths } from 'utils/Constants';
import AdminTasks from '../../pages/AdminTasks/AdminTasks';

const Admin: React.FC = () => {

    return (
        <>
            <div className={styles.pageContent}>
                <Routes>
                    <Route path={Paths.Administration_Planning_Relative} element={<AdminPlanning />} />
                    <Route path={Paths.Administration_Tasks_Relative} element={<AdminTasks />} />
                    <Route index element={<Navigate to={Paths.Administration_Planning} replace />} />
                </Routes>
            </div>
            <Toaster />
        </>
    );
};

export default Admin;