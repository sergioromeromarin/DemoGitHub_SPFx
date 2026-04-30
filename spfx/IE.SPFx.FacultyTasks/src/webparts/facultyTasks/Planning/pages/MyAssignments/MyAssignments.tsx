import * as React from "react";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { Planning } from "FacultyTasksWebPartStrings";
import AssignedSubjects from "../../components/AssignedSubjects/AssignedSubjects";

const MyAssignments: React.FC = () => {
  return (
    <>
      <SectionHeader
        label={Planning.MyAssigments.Header.Tag}
        title={Planning.MyAssigments.Header.Title}
        subtitle={Planning.MyAssigments.Header.Subtitle}
      />
      <AssignedSubjects />
    </>
  );
};

export default MyAssignments;
