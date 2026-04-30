
import * as React from 'react';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import ListPeriods from '../../components/AdminPlanning/ListPeriods/ListPeriods';
import DetailPeriod from '../../components/AdminPlanning/DetailPeriod/DetailPeriod';
import PeriodForm from '../../components/AdminPlanning/PeriodForm/PeriodForm';
import DeletePeriod from '../../components/AdminPlanning/DeletePeriod/DeletePeriod';
import FacultyAvailabilities from '../../components/AdminPlanning/FacultyAvailabilities/FacultyAvailabilities';
import FacultyAssignments from '../../components/AdminPlanning/FacultyAssignments/FacultyAssignments';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from 'store/useAppStore';
import SectionHeader from '../../../components/SectionHeader/SectionHeader';
import { Admin } from 'FacultyTasksWebPartStrings';

const AdminPlanning: React.FC = () => {

    const { serviceScope } = useAppStore();
    const { isDataLoaded, loadPeriods } = useAdminPlanningStore();

    React.useEffect(() => {
        if (serviceScope)
            loadPeriods(serviceScope).catch(console.error);
    }, [serviceScope]);

    return (
        <>
            <SectionHeader title={Admin.Planning.HeaderTitle}/>
            <ListPeriods isDataLoaded={isDataLoaded} />
            <DetailPeriod />
            <PeriodForm />
            <DeletePeriod />
            <FacultyAvailabilities />
            <FacultyAssignments />
            <Toaster />
        </>
    );
};

export default AdminPlanning;
