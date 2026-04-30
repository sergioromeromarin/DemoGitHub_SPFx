import * as React from "react";
import styles from "./TaskCard.module.scss";
import { DefaultButton, Icon, Persona, PersonaSize } from "@fluentui/react";
import { ITaskCardProps } from "./models";
import strings, { MyTasks } from "FacultyTasksWebPartStrings";
import { CULTURE_NAME_ES } from "utils/Constants";
import { useTasksStore } from "store/useTasksStore";
import { getStatusLabel } from "utils/Utils";
import { TooltipHost } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { Paths } from "utils/Constants";

const TaskCard: React.FC<ITaskCardProps> = ({ task }) => {

  const user = useTasksStore(s => s.usersByEmail[task.supervisor]);
  
  const navigate = useNavigate();

  const onOpen = React.useCallback(() => {
    const url = (task.url ?? "").trim();
    if (!url) return;

    const urlToLowerCase = url.toLowerCase();

    if (urlToLowerCase === "planning") {
      navigate(Paths.Planning_MyAvailabitity);
      return;
    }

    if (urlToLowerCase === "assigment") {
      navigate(Paths.Planning_MyAssignments);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }, [task.url, navigate]);

  
  return (
    <div className={styles.card}>
       <div className={styles.imageSection}>
          {task.imageUrl && <img src={task.imageUrl} alt="" />}
        </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Icon iconName="BulletedList" className={styles.headerIcon} />
          <TooltipHost content={task.type ?? ""}>
            <div className={styles.headerTitle}>{(task.type ?? "").toUpperCase()}</div>
          </TooltipHost>
        </div>

        <div className={styles.divider} />

        <div className={styles.status}>{(task.status ? getStatusLabel(task.status) : strings.MyTasks.Status.Pending).toUpperCase()}</div>

        <div className={styles.description} title={task.description}>
          {task.description}
        </div>

      <div className={styles.bottom}>

        <div className={styles.footer}>
          <div className={styles.dueDate}>
            <div className={styles.metaLabel}>{MyTasks.Carrousel.DueDate}</div>
            <div className={styles.metaValue}>{task?.dueDate ? new Date(task.dueDate).toLocaleDateString(CULTURE_NAME_ES, { year: "numeric", month: "2-digit", day: "2-digit" }) : ""}</div>
          </div>

          <div className={styles.supervisor}>
            <div  title={task.supervisor}>
                <Persona
                  className={styles.supervisorPersona}
                  text={user?.email ?? task.supervisor}
                  imageUrl={user?.photoUrl}
                  size={PersonaSize.size24}
                  
                />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <DefaultButton text={MyTasks.Carrousel.SeeMore} onClick={onOpen} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default TaskCard;
