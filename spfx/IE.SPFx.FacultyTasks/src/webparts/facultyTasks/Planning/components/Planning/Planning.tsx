import * as React from 'react';
import styles from './Planning.module.scss';
import { Routes, Route } from 'react-router-dom';
import MyAvailability from '../../pages/MyAvailability/MyAvailability';
// import MySessions from '../../pages/MySessions/MySessions';
import MyAssignments from '../../pages/MyAssignments/MyAssignments';
import PlanningHome from '../../pages/PlanningHome/PlanningHome';
import { Toaster } from 'react-hot-toast';
import { Paths } from 'utils/Constants';

const Planning: React.FC<{}> = () => {

    return (
        <>
            <div className={styles.pageContent}>
                <Routes>
                    <Route index element={<PlanningHome />} />
                    <Route path={Paths.Planning_MyAvailabitity_Relative} element={<MyAvailability />} />
                    <Route path={Paths.Planning_MyAssignments_Relative} element={<MyAssignments />} />
                    {/* <Route path={Paths.Planning_MySessions_Relative} element={<MySessions />} /> */}
                </Routes>
            </div>
            <Toaster />
        </>
    );
};

export default Planning;