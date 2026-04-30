import * as React from "react";
import type { IDropdownOption } from "@fluentui/react";
import type { Task } from "types";
import { IUseTasksTableFiltersResult } from "../models";

const SELECT_ALL_KEY = -1;

export const useTasksTableFilters = (tasks: Task[] | undefined, cultureName: string): IUseTasksTableFiltersResult => {
  const [searchText, setSearchText] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);

  const query = searchText.trim().toLowerCase();

  const matchesSearch = React.useCallback((task: Task): boolean => {
      if (!query) return true;

      const searchableText = [task.type, task.description, task.status, task.supervisor].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(query);
   },[query]);

  const originalAllTasks = tasks ?? [];

  const typeOptions = React.useMemo<IDropdownOption[]>(() => {
    const filteredForType = originalAllTasks.filter(matchesSearch);

    const distinctTypes = Array.from(new Set(filteredForType.map((t) => t.type).filter(Boolean))).sort();

    return distinctTypes.map((type) => ({ key: type, text: type }));
  }, [originalAllTasks, matchesSearch]);
 

  const isAllTypesSelected = !!typeOptions.length && selectedTypes.length === typeOptions.length;

  // Lista final (suma filtros: search + types)
  const filteredTasks = React.useMemo<Task[]>(() => {
    return originalAllTasks.filter((t) => {
      if (!matchesSearch(t)) return false;

      if (selectedTypes.length && !selectedTypes.includes(t.type)) return false;
      return true;
    });
  }, [originalAllTasks, matchesSearch, selectedTypes]);

  // Select all estable
  const onTypeChange = React.useCallback((option: IDropdownOption) => {
      if (option.key === SELECT_ALL_KEY) {
        setSelectedTypes(option.selected ? typeOptions.map((o) => String(o.key)) : []);
        return;
      }

      const key = String(option.key);
      setSelectedTypes((prev) => (option.selected ? [...prev, key] : prev.filter((k) => k !== key)));
   },[typeOptions]);


  return {
    searchText,
    setSearchText,
    selectedTypes,
    typeOptions,
    filteredTasks,
    onTypeChange,
    isAllTypesSelected
  };
};

export const TasksTableFilterKeys = {
  SelectAll: SELECT_ALL_KEY
};
