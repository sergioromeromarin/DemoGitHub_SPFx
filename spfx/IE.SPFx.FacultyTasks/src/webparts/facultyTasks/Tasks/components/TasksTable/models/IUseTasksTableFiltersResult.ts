import { IDropdownOption } from "@fluentui/react";
import { Task } from "types";

export interface IUseTasksTableFiltersResult {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedTypes: string[];
  typeOptions: IDropdownOption[];
  filteredTasks: Task[];
  onTypeChange: (option: IDropdownOption) => void;
  isAllTypesSelected: boolean;
}
