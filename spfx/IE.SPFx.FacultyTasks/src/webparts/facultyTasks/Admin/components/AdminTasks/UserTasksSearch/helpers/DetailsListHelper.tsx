import * as React from 'react';
import { IColumn } from '@fluentui/react/lib/DetailsList';
import { MyTasks } from 'FacultyTasksWebPartStrings';
import type { Task } from 'types';
import { TaskStatus } from 'utils/Constants';
import styles from '../UserTasksSearch.module.scss';
import { Persona, PersonaSize } from "@fluentui/react";
import { useTasksStore } from "store/useTasksStore";
import { getStatusLabel } from 'utils/Utils';

const getColumnDefinitions = (currentUICultureName: string): IColumn[] => {

  return [
    {
      key: 'column1',
      name: MyTasks.Table.Columns.Type,
      fieldName: 'type',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: Task) => {
        return <span className={styles.taskTypeColumn}>{item?.type}</span>;
      },
      data: 'string'
    },
    {
      key: 'column2',
      name: MyTasks.Table.Columns.Description,
      fieldName: 'description',
      minWidth: 300,
      
      isResizable: true,
      isMultiline: true,
      data: 'string'
    },
    {
      key: 'column3',
      name: MyTasks.Table.Columns.Status,
      fieldName: 'status',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Task) => {

        const statusLabel = getStatusLabel(item.status);

        switch (item.status) {
          case TaskStatus.pending: return <span className={styles.statusPendingColumn}>{statusLabel}</span>;
          case TaskStatus.completed: return <span className={styles.statusCompletedColumn}>{statusLabel}</span>;
          default: return <span>{statusLabel}</span>;
        }
      },
      data: 'string'
    },
    {
      key: 'column4',
      name: MyTasks.Table.Columns.DueDate,
      fieldName: 'dueDate',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Task) => {
        return <span>{item?.dueDate ? new Date(item.dueDate).toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}</span>;
      },
      data: 'string'
    },
    {
      key: 'column5',
      name: MyTasks.Table.Columns.Supervisor,
      fieldName: 'supervisor',
      minWidth: 220,
      maxWidth: 220,
      isResizable: true,
     onRender: (item: Task) => {
        const user = useTasksStore.getState().usersByEmail[item.supervisor];

        return (
          <Persona
            text={user?.displayName ?? item.supervisor}
            imageUrl={user?.photoUrl}
            size={PersonaSize.size32}

          />
        );
      },
      data: 'string'
    }
  ]
}

export default getColumnDefinitions;