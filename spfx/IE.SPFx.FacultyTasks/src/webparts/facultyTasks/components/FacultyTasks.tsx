import * as React from "react";
import styles from "./FacultyTasks.module.scss";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Planning from "../Planning/components/Planning/Planning";
import MainMenu from "./MainMenu/MainMenu";
import Tasks from "../Tasks/components/Tasks/Tasks";
import { useInitializeUser } from "hooks/useInitializeUser";
import { AdminGroupId, UserGroupId, TaskUserGroupId } from "appSettings";
import { useAppStore } from "store/useAppStore";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import DefaultRedirect from "./DefaultRedirect/DefaultRedirect";
import NoAccess from "../pages/NoAccess";
import { Paths, Roles } from "utils/Constants";
import Admin from "../Admin/components/Admin/Admin";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Loader from "./Loader/Loader";
import CheckRedirection from "./CheckRedirection/CheckRedirection";

const FacultyTasks: React.FC<{}> = () => {
  useInitializeUser(AdminGroupId, UserGroupId, TaskUserGroupId);
  const { isLoading: loading } = useAppStore();
  initializeIcons();

  return (
    <div className={styles.facultyTasksContainer}>
      {loading ? (
        <Loader heightVH={95} />
      ) : (
        <>
          <Router>
            <CheckRedirection />
            <Header />
            <MainMenu />
            <Routes>
              <Route
                path={Paths.Planning_All}
                element={
                  <ProtectedRoute requiredRole={Roles.user}>
                    <Planning />
                  </ProtectedRoute>
                }
              />
              <Route
                path={Paths.Tasks_All}
                element={
                  <ProtectedRoute requiredRole={Roles.taskUser}>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path={Paths.Requests}
                element={
                  <ProtectedRoute requiredRole={Roles.user}>
                    <div className={styles.page}>Example page for Requests</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path={Paths.Evaluations}
                element={
                  <ProtectedRoute requiredRole={Roles.user}>
                    <div className={styles.page}>Example page for Evaluations</div>
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path={Paths.Administration_All}
                element={
                  <ProtectedRoute requiredRole={Roles.admin}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path={Paths.NoAccess} element={<NoAccess />} />
              <Route path={Paths.Root} element={<DefaultRedirect />} />
            </Routes>
            <Footer />
          </Router>
        </>
      )}
    </div>
  );
};

export default FacultyTasks;
