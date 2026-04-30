import { Planning } from 'FacultyTasksWebPartStrings';
import * as React from 'react';
import SectionHeader from '../../../components/SectionHeader/SectionHeader';

const MySessions: React.FC = () => {
    return (
        <>
            <SectionHeader
                label={Planning.MySessions.Header.Tag}
                title={Planning.MySessions.Header.Title}
                subtitle={Planning.MySessions.Header.Subtitle} />
        </>
    );
};

export default MySessions;
