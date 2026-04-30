import * as React from 'react';
import SectionHeader from '../../../components/SectionHeader/SectionHeader';
import { Planning } from 'FacultyTasksWebPartStrings';
import { AvailabilityTable } from '../../components/AvailabilityTable/AvailabilityTable';

const MyAvailability: React.FC<{}> = () => {
    return (
        <>
            <SectionHeader
                label={Planning.MyAvailability.Header.Tag}
                title={Planning.MyAvailability.Header.Title}
                subtitle={Planning.MyAvailability.Header.Subtitle} />
            <AvailabilityTable />
        </>
    );
};

export default MyAvailability;
