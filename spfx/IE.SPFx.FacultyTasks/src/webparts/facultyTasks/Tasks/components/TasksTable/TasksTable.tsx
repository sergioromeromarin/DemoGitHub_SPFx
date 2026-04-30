import * as React from "react";
import { ITasksTableProps } from "./models";
import styles from "./TasksTable.module.scss";
import { MyTasks } from "FacultyTasksWebPartStrings";
import { CheckboxVisibility, DetailsListLayoutMode, Dropdown, IColumn, IDropdownOption, SearchBox, ShimmeredDetailsList } from "@fluentui/react";
import getColumnDefinitions from "./helpers/DetailsListHelper";
import { useAppStore } from "store/useAppStore";
import { CULTURE_NAME_ES } from "utils/Constants";
import { useTasksTableFilters, TasksTableFilterKeys } from "./hooks/useTasksTableFilters";

const TasksTable: React.FC<ITasksTableProps> = (props) => {

  const { currentUICultureName } = useAppStore();
  const cultureName = currentUICultureName || CULTURE_NAME_ES;

  const { isDataLoaded, tasks } = props;

  const { searchText, setSearchText,selectedTypes, typeOptions, filteredTasks, onTypeChange, isAllTypesSelected} = useTasksTableFilters(tasks, cultureName);

  const columnsTasks: IColumn[] = getColumnDefinitions(cultureName);

  const computedTypeOptions: IDropdownOption[] = React.useMemo(() => {
    return [{ key: TasksTableFilterKeys.SelectAll, text: MyTasks.Table.Filters.SelectAll }, ...typeOptions];
  }, [typeOptions]);

  const selectedTypeKeys = React.useMemo(() => {
    return isAllTypesSelected ? [...selectedTypes, TasksTableFilterKeys.SelectAll] : selectedTypes;
  }, [selectedTypes, isAllTypesSelected]);

  const renderMultiTitle = React.useCallback((selectedOptions: IDropdownOption[] | undefined, allText: string) => {
      const real = (selectedOptions ?? []).filter(o => o.key !== TasksTableFilterKeys.SelectAll);

      if (!real.length) return <span className={styles.dropdownTitleWrap}>{allText}</span>;
      if (real.length === 1) return <span className={styles.dropdownTitleWrap}>{real[0].text}</span>;

      return (
        <span className={styles.dropdownTitleWrap}>
          {MyTasks.Table.Filters.SelectedCount.replace("{0}", String(real.length))}
        </span>
      );
    },
    []
  );

  const renderTypeTitle = React.useCallback((selectedOptions?: IDropdownOption[]) => renderMultiTitle(selectedOptions, MyTasks.Table.Filters.AllTypes),[renderMultiTitle]);

  return (
    <section className={styles.tableContainer}>
      <div>
        <div className={styles.title}>{MyTasks.Table.Title}</div>
        <div className={styles.subTitle}>{MyTasks.Table.Subtitle}</div>
      </div>
      <div>
       <div className={styles.searchRow}>
          <SearchBox
            className={styles.searchBox}
            placeholder={MyTasks.Table.SearchBoxTooltip}
            value={searchText}
            onChange={(_, newValue) => setSearchText(newValue ?? "")}
          />

          <div className={styles.filtersRight}>
            <div className={styles.filterField}>
              <div className={styles.filterLabel}>{MyTasks.Table.Filters.TypeLabel}</div>
              <Dropdown
                className={styles.filterDropdown}
                placeholder={MyTasks.Table.Filters.AllTypes}
                multiSelect
                calloutProps={{
                  styles: {
                    root: { width: 420 }
                  }
                }}
                selectedKeys={selectedTypeKeys as string[]}
                options={computedTypeOptions}
                onChange={(_, opt) => opt && onTypeChange(opt)}
                onRenderTitle={renderTypeTitle}
              />
            </div>
          </div>
        </div>

        <ShimmeredDetailsList
          items={filteredTasks}
          columns={columnsTasks}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
          checkboxVisibility={CheckboxVisibility.hidden}
          enableShimmer={!isDataLoaded}
          shimmerLines={7}
          styles={{ root: { width: "100%" } }}
        />
      </div>
    </section>);
};

export default TasksTable;
