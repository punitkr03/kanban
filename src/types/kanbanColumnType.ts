import Task from "./taskType";

interface KanbanColumn {
  id: number;
  title: string;
  color: string;
  tasks: Task[];
}

export default KanbanColumn;
