import { Task } from "./task";
import { Variable } from "./variable";

export interface ImportDataType {
  tasks: Task[],
  variables: Variable[];
}

export const isImportDataType = (data: any): data is ImportDataType => {
  return Array.isArray(data.tasks) && Array.isArray(data.variables);
};
