export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export type TasksFilter = "all" | "todo" | "done";
