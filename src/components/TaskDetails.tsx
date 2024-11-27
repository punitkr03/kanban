import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import Task from "../types/taskType";
import React from "react";
import { toast } from "sonner";
import KanbanColumn from "../types/kanbanColumnType";

interface TaskDetailsProps {
  open: boolean;
  setTaskDetailsDialogOpen: (open: boolean) => void;
  task: Task;
  availableStatus: string[];
  columnId: number;
  setColumns: (columns: KanbanColumn[]) => void;
  columns: KanbanColumn[];
}

export default function TaskDetails({
  open,
  setTaskDetailsDialogOpen,
  task,
  availableStatus,
  columnId,
  setColumns,
  columns,
}: TaskDetailsProps) {
  const [newTask, setNewTask] = React.useState<Task>({
    id: task.id,
    title: task.title,
    status: task.status,
    description: task.description,
  });

  React.useEffect(() => {
    if (open) {
      setNewTask({
        id: task.id,
        title: task.title,
        status: task.status,
        description: task.description,
      });
    }
  }, [open, task]);

  const handleEditTask = () => {
    if (!newTask.title || !newTask.status || !newTask.description) {
      toast.warning("Please fill all the fields");
      return;
    }

    // If status changed, move the task to new column
    if (task.status !== newTask.status) {
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== task.id),
          };
        }
        if (column.title === newTask.status) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      });
      setColumns(newColumns);
    } else {
      // Else update the task in current column
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((t) => (t.id === task.id ? newTask : t)),
          };
        }
        return column;
      });
      setColumns(newColumns);
    }

    setTaskDetailsDialogOpen(false);
  };

  const handleDeleteTask = () => {
    console.log(columnId);
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== task.id),
        };
      }
      return column;
    });
    setColumns(newColumns);
    setTaskDetailsDialogOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setTaskDetailsDialogOpen(false);
      }}
      fullWidth
    >
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent className="grid gap-3">
        <TextField
          label="Task Title"
          defaultValue={task.title}
          placeholder="Enter task title"
          sx={{
            marginTop: 1,
          }}
          onChange={(e) => {
            setNewTask((task) => {
              return {
                ...task,
                title: e.target.value,
              };
            });
          }}
        />
        <TextField
          label="Description"
          multiline
          minRows={4}
          defaultValue={task.description}
          onChange={(e) => {
            setNewTask((task) => {
              return {
                ...task,
                description: e.target.value,
              };
            });
          }}
        />
        <TextField
          label="Status"
          select
          minRows={4}
          defaultValue={task.status}
          onChange={(e) => {
            setNewTask((task) => {
              return {
                ...task,
                status: e.target.value,
              };
            });
          }}
        >
          {availableStatus &&
            availableStatus.map((status) => {
              return (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              );
            })}
        </TextField>
        <div className="flex gap-2 justify-end">
          <Button
            sx={{
              backgroundColor: "#d83d31",
            }}
            variant="contained"
            onClick={() => {
              handleDeleteTask();
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleEditTask();
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
