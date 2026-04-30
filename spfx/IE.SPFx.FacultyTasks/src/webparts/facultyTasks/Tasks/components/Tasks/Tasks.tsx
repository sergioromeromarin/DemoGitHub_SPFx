import * as React from "react";
import { Routes, Route } from "react-router-dom";
import MyPendingTasks from "../../pages/MyPendingTasks/MyPendingTasks";
import { Paths } from "utils/Constants";

const Tasks: React.FC = () => {
  return (
    <>
      <div>
        <Routes>
          <Route
            path={Paths.Tasks_MyPendingTasks_Relative}
            element={<MyPendingTasks />}
          />
        </Routes>
      </div>
    </>
  );
};

export default Tasks;
