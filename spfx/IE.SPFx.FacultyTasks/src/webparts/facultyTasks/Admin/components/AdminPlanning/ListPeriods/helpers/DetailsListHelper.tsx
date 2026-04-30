import * as React from 'react';
import { IColumn } from '@fluentui/react/lib/DetailsList';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { Admin } from 'FacultyTasksWebPartStrings';
import type { Period } from 'types';
import { getDateColor } from 'utils/Utils';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { CULTURE_NAME_ES } from 'utils/Constants';

const getColumnDefinitions = (currentUICultureName: string): IColumn[] => {
  const setIsModalOpen_PeriodForm = useAdminPlanningStore((state) => state.setIsModalOpen_PeriodForm);
  const setIsDialogHidden_DeletePeriod = useAdminPlanningStore((state) => state.setIsDialogHidden_DeletePeriod);
  const setIsModalOpen_AvailabilitiesPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_FacultyAvailabilities);
  const setIsModalOpen_AssignmentsPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_FacultyAssignments);

  return [
    {
      key: 'column1',
      name: Admin.Planning.ListPeriod.Col_Course,
      fieldName: 'course',
      minWidth: 140,
      maxWidth: 150,
      isResizable: true,
      data: 'string'
    },
    {
      key: 'column2',
      name: Admin.Planning.ListPeriod.Col_Name,
      fieldName: 'name',
      minWidth: 150,
      maxWidth: 170,
      isResizable: true,
      isMultiline: true,
      data: 'string'
    },
    {
      key: 'column3',
      name: Admin.Planning.ListPeriod.Col_PeriodStartDate,
      fieldName: 'periodStartDate',
      minWidth: 108,
      maxWidth: 108,
      isResizable: true,
      onRender: (item: Period) => {
        return <span>{item?.periodStartDate ? new Date(item.periodStartDate).toLocaleDateString(CULTURE_NAME_ES, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}</span>;
      },
      data: 'string'
    },
    {
      key: 'column4',
      name: Admin.Planning.ListPeriod.Col_PeriodEndDate,
      fieldName: 'periodEndDate',
      minWidth: 105,
      maxWidth: 105,
      isResizable: true,
      onRender: (item: Period) => {
        return <span style={{ color: getDateColor(item?.periodEndDate) }}>{item?.periodEndDate ? new Date(item.periodEndDate).toLocaleDateString(CULTURE_NAME_ES, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}</span>;
      },
      data: 'string'
    },
    {
      key: 'column5',
      name: Admin.Planning.ListPeriod.Col_AvailabilityStartDate,
      fieldName: 'availabilityStartDate',
      minWidth: 136,
      maxWidth: 136,
      isResizable: true,
      onRender: (item: Period) => {
        return <span>{item?.availabilityStartDate ? new Date(item.availabilityStartDate).toLocaleDateString(CULTURE_NAME_ES, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}</span>;
      },
      data: 'string'
    },
    {
      key: 'column6',
      name: Admin.Planning.ListPeriod.Col_AvailabilityEndDate,
      fieldName: 'availabilityEndDate',
      minWidth: 130,
      maxWidth: 130,
      isResizable: true,
      onRender: (item: Period) => {
        return <span style={{ color: getDateColor(item?.availabilityEndDate) }}>{item?.availabilityEndDate ? new Date(item.availabilityEndDate).toLocaleDateString(CULTURE_NAME_ES, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}</span>;
      },
      data: 'string'
    },
    {
      key: 'column7',
      name: Admin.Planning.ListPeriod.Col_Edit,
      fieldName: 'Edit',
      minWidth: 40,
      maxWidth: 40,
      isResizable: false,
      onRender: (item: Period) => {
        return (<FontIcon iconName="Edit" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen_PeriodForm(true)} />);
      }
    },
    {
      key: 'column8',
      name: Admin.Planning.ListPeriod.Col_Delete,
      fieldName: 'Delete',
      minWidth: 42,
      maxWidth: 42,
      isResizable: false,
      onRender: (item: Period) => {
        return (
          <>
            {item.hasAvailabilities ?
              <FontIcon iconName="Delete" style={{ opacity: 0.6, cursor: 'not-allowed' }} title={Admin.Planning.ListPeriod.Col_Delete_TooltipCannotDelete} /> :
              <FontIcon iconName="Delete" style={{ cursor: 'pointer' }} onClick={() => setIsDialogHidden_DeletePeriod(false)} />
            }
          </>
        );
      }
    },
    {
      key: 'column9',
      name: Admin.Planning.ListPeriod.Col_FacultyAvailabilities,
      fieldName: 'FacultyAvailabilities',
      minWidth: 130,
      maxWidth: 130,
      isResizable: false,
      onRender: (item: Period) => {
        return (<FontIcon iconName="Feedback" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen_AvailabilitiesPeriod(true)} />);
      }
    },
    {
      key: 'column10',
      name: Admin.Planning.ListPeriod.Col_FacultyAssignments,
      fieldName: 'FacultyAssignments',
      minWidth: 40,
      maxWidth: 40,
      isResizable: false,
      onRender: (item: Period) => {
        return (<FontIcon iconName="Education" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen_AssignmentsPeriod(true)} />);
      }
    }
  ]
}

export default getColumnDefinitions;