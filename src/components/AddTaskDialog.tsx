import { Button, DialogContent, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useMemo } from "react";
import { toast } from "sonner";
import KanbanColumn from "../types/kanbanColumnType";
import Task from "../types/taskType";

export interface AddTaskDialogProps {
  open: boolean;
  setAddTaskDialogOpen: (open: boolean) => void;
  columnId: number;
  columns: KanbanColumn[];
  setColumns: (columns: KanbanColumn[]) => void;
}

export default function AddTaskDialog(props: AddTaskDialogProps) {
  const { setAddTaskDialogOpen, open, columnId, columns, setColumns } = props;
  const status = useMemo(() => {
    const col = columns.find((col) => columnId === col.id);
    return col!.title as string;
  }, [columnId, columns]);

  const [task, setTask] = React.useState<Task>({
    id: btoa(crypto.randomUUID().replace(/-/g, "")),
    title: "",
    status: "",
    description: "",
  });

  console.log(status);

  const handleAddTask = () => {
    if (!task.title || !task.description) {
      toast.warning("Please fill all the fields");
      return;
    }
    console.log("task.status", task.status);
    const newColumns = columns.map((column) => {
      const updatedTask = {
        ...task,
        status: status,
      };
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, updatedTask],
        };
      }
      return column;
    });
    setColumns(newColumns);
    setAddTaskDialogOpen(false);
    // Reset task
    setTask({
      id: btoa(crypto.randomUUID().replace(/-/g, "")),
      title: "",
      status: "",
      description: "",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setAddTaskDialogOpen(false);
        setTask({
          id: btoa(crypto.randomUUID().replace(/-/g, "")),
          title: "",
          status: "",
          description: "",
        });
      }}
      fullWidth
    >
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent className="grid gap-3">
        <TextField
          label="Task Title"
          placeholder="Enter task title"
          sx={{
            marginTop: 1,
          }}
          onChange={(e) => {
            setTask((task) => {
              return { ...task, title: e.target.value };
            });
          }}
        />
        <TextField
          label="Description"
          multiline
          minRows={4}
          onChange={(e) => {
            setTask((task) => {
              return { ...task, description: e.target.value };
            });
          }}
        />
        <Button
          variant="contained"
          sx={{ alignSelf: "flex-end", width: 100, marginLeft: "auto" }}
          onClick={() => {
            handleAddTask();
          }}
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
}
