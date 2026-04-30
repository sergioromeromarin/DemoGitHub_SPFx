import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MainMenu.module.scss";
import { useAppStore } from "store/useAppStore";
import Dialog, { DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Menu } from "FacultyTasksWebPartStrings";
import { Paths } from "utils/Constants";

const MainMenu: React.FC<{}> = () => {
  const { isAdmin, isUser, isTaskUser } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnsavedChanges, clearUnsavedChanges } = useAppStore();

  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);

  const [isPlanningOpen, setIsPlanningOpen] = React.useState(false);
  const [isTasksOpen, setIsTasksOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);

  const planningBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const planningMenuRef = React.useRef<HTMLDivElement | null>(null);
  const tasksBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const tasksMenuRef = React.useRef<HTMLDivElement | null>(null);
  const adminBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const adminMenuRef = React.useRef<HTMLDivElement | null>(null);

  const handleNavigate = (path: string): void => {
    if (path === location.pathname) {
      setIsPlanningOpen(false);
      setIsTasksOpen(false);
      setIsAdminOpen(false);
      return;
    }
    if (hasUnsavedChanges) {
      setPendingRoute(path);
      setShowDialog(true);
    } else {
      navigate(path);
      setIsPlanningOpen(false);
      setIsTasksOpen(false);
      setIsAdminOpen(false);
    }
  };

  const confirmNavigation = (): void => {
    clearUnsavedChanges();
    if (pendingRoute) navigate(pendingRoute);
    setShowDialog(false);
    setPendingRoute(null);
    setIsPlanningOpen(false);
    setIsTasksOpen(false);
    setIsAdminOpen(false);
  };

  const cancelNavigation = (): void => {
    setShowDialog(false);
    setPendingRoute(null);
  };

  const togglePlanningMenu = (): void => {
    setIsPlanningOpen((prev) => !prev);
  };

  //   const toggleTasksMenu = (): void => {
  //     setIsTasksOpen((prev) => !prev);
  //   };

  const toggleAdminMenu = (): void => {
    setIsAdminOpen((prev) => !prev);
  };

  // Cerrar si se hace click fuera
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent): void => {
      const target = e.target as Node;

      // Check Planning menu
      if (
        isPlanningOpen &&
        planningBtnRef.current &&
        planningMenuRef.current &&
        !planningBtnRef.current.contains(target) &&
        !planningMenuRef.current.contains(target)
      ) {
        setIsPlanningOpen(false);
      }

      // Check Tasks menu
      if (
        isTasksOpen &&
        tasksBtnRef.current &&
        tasksMenuRef.current &&
        !tasksBtnRef.current.contains(target) &&
        !tasksMenuRef.current.contains(target)
      ) {
        setIsTasksOpen(false);
      }

      // Check Admin menu
      if (
        isAdminOpen &&
        adminBtnRef.current &&
        adminMenuRef.current &&
        !adminBtnRef.current.contains(target) &&
        !adminMenuRef.current.contains(target)
      ) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isPlanningOpen, isTasksOpen, isAdminOpen]);

  return (
    <>
      {(isUser || isAdmin) && (
        <nav className={styles.mainMenu}>
          {isTaskUser && (
            <div className={styles.menuGroup}>
              <button
                ref={tasksBtnRef}
                onClick={() => handleNavigate(Paths.Tasks_MyPendingTasks)}
                aria-expanded={isTasksOpen}
                // aria-haspopup="menu"
                className={`${styles.menuItem} ${location.pathname.startsWith(Paths.Tasks) ? styles.active : ""}`}
              >
                {Menu.Tasks.Title}
              </button>
            </div>
          )}
          {isUser && (
            <div className={styles.menuGroup}>
              <button
                ref={planningBtnRef}
                onClick={() => handleNavigate(Paths.Planning)}
                aria-expanded={isPlanningOpen}
                aria-haspopup="menu"
                className={`${styles.menuItem} ${location.pathname.startsWith(Paths.Planning) ? styles.active : ""}`}
              >
                {Menu.Planning.Title}
                <span 
                  className={styles.caret} 
                  aria-hidden="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlanningMenu();
                  }}
                >
                  ▾
                </span>
              </button>

              {isPlanningOpen && (
                <div
                  ref={planningMenuRef}
                  role="menu"
                  className={styles.dropdown}
                >
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() =>
                      handleNavigate(Paths.Planning_MyAvailabitity)
                    }
                  >
                    {Menu.Planning.MyAvailability}
                  </button>
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate(Paths.Planning_MyAssignments)}
                  >
                    {Menu.Planning.MyAssignments}
                  </button>
                  {/* <button
                                        role="menuitem"
                                        className={styles.dropdownItem}
                                        onClick={() => handleNavigate(Paths.Planning_MySessions)}
                                    >
                                        {Menu.Planning.MySessions}
                                    </button> */}
                </div>
              )}
            </div>
          )}
          {/* Examples page for Requests and Evaluations */}
          {/* {isUser &&
                        <button
                            onClick={() => handleNavigate(Paths.Requests)}
                            className={`${styles.menuItem} ${location.pathname.startsWith(Paths.Requests) ? styles.active : ''}`}>
                            {Menu.Requests.Title}
                        </button>
                    }
                    {isUser &&
                        <button
                            onClick={() => handleNavigate(Paths.Evaluations)}
                            className={`${styles.menuItem} ${location.pathname.startsWith(Paths.Evaluations) ? styles.active : ''}`}>
                            {Menu.Evaluations.Title}
                        </button>} */}
          {isAdmin && (
            <div className={styles.menuGroup}>
              <button
                ref={adminBtnRef}
                onClick={toggleAdminMenu}
                aria-expanded={isAdminOpen}
                aria-haspopup="menu"
                className={`${styles.menuItem} ${location.pathname.startsWith(Paths.Administration) ? styles.active : ""}`}
              >
                {Menu.Administration.Title}
                <span className={styles.caret} aria-hidden="true">
                  ▾
                </span>
              </button>

              {isAdminOpen && (
                <div ref={adminMenuRef} role="menu" className={styles.dropdown}>
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() =>
                      handleNavigate(Paths.Administration_Planning)
                    }
                  >
                    {Menu.Administration.Planning}
                  </button>
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate(Paths.Administration_Tasks)}
                >
                    {Menu.Administration.Tasks}
                </button>
                </div>
              )}
            </div>
          )}

          <Dialog
            hidden={!showDialog}
            dialogContentProps={{
              type: DialogType.normal,
              title: Menu.UnsaveChangesWarning.ModalTitle,
              subText: Menu.UnsaveChangesWarning.Message,
            }}
            onDismiss={cancelNavigation}
          >
            <DialogFooter>
              <PrimaryButton
                text={Menu.UnsaveChangesWarning.LeaveBtn}
                onClick={confirmNavigation}
              />
              <DefaultButton
                text={Menu.UnsaveChangesWarning.StayBtn}
                onClick={cancelNavigation}
              />
            </DialogFooter>
          </Dialog>
        </nav>
      )}
    </>
  );
};

export default MainMenu;
