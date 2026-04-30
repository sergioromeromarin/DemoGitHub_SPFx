import { MyTasks } from "FacultyTasksWebPartStrings";
import * as React from "react";
import TasksDueSoonCarrousel from "../../components/TasksDueSoonCarrousel/TasksDueSoonCarrousel";
import TasksTable from "../../components/TasksTable/TasksTable";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useTasksStore } from "store/useTasksStore";
import { useAppStore } from "store/useAppStore";

const MyPendingTasks: React.FC = () => {
  const { serviceScope } = useAppStore();
  const { isDataLoaded, loadTasks, tasks,tasksDueSoon } = useTasksStore();

  React.useEffect(() => {
    if (serviceScope) loadTasks(serviceScope).catch(console.error);
  }, [serviceScope]);

  return (
    <>
      <SectionHeader
        label={MyTasks.Header.Tag}
        title={MyTasks.Header.Title}
        subtitle={MyTasks.Header.Subtitle}
      />
      <TasksDueSoonCarrousel isDataLoaded={isDataLoaded} tasks={tasksDueSoon} />
      <TasksTable isDataLoaded={isDataLoaded} tasks={tasks} />
    </>
  );
};

export default MyPendingTasks;
