import { Task } from "./task";
import { Variable } from "./variable";

export interface ImportDataType {
  tasks: Task[],
  variables: Variable[];
}
