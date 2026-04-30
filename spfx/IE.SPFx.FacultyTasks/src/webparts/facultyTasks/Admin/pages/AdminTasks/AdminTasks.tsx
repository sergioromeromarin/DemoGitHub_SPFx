
import * as React from 'react';
import UserTasks from '../../components/AdminTasks/UserTasksSearch/UserTasksSearch';
import { Admin } from 'FacultyTasksWebPartStrings';
import SectionHeader from '../../../components/SectionHeader/SectionHeader';

const AdminTasks: React.FC = () => {
    return (
        <>
            <SectionHeader title={Admin.Tasks.HeaderTitle}/>
            <UserTasks/>
        </>
    );
};

export default AdminTasks;
