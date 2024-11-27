import { Button, DialogContent, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Circle } from "lucide-react";
import React, { useMemo } from "react";
import { toast } from "sonner";
import KanbanColumn from "../types/kanbanColumnType";

export interface AddTaskDialogProps {
  open: boolean;
  setAddTaskDialogOpen: (open: boolean) => void;
  columns: KanbanColumn[];
  setColumns: (columns: KanbanColumn[]) => void;
  availableStatus: string[];
}

export default function AddColumnDialog(props: AddTaskDialogProps) {
  const { setAddTaskDialogOpen, open, columns, setColumns, availableStatus } =
    props;
  const colors = ["#ffcbd7", "#fce1a1", "#cce8e1"];

  const newColumnId = useMemo(
    () => columns[columns.length - 1].id + 1,
    [columns]
  );

  const [column, setColumn] = React.useState<KanbanColumn>({
    id: newColumnId,
    title: "",
    color: "",
    tasks: [],
  });

  React.useEffect(() => {
    if (open) {
      setColumn({
        id: newColumnId,
        title: "",
        color: "",
        tasks: [],
      });
    }
  }, [open, newColumnId]);

  const handleAddTask = () => {
    if (!column.title) {
      toast.warning("Please add a title.");
      return;
    }
    if (availableStatus.includes(column.title)) {
      toast.warning("Column with the same title already exists.");
      return;
    }

    setColumns([...columns, column]);
    setAddTaskDialogOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setAddTaskDialogOpen(false);
        setColumn({
          id: newColumnId,
          title: "",
          color: "",
          tasks: [],
        });
      }}
      fullWidth
    >
      <DialogTitle>Add New Status</DialogTitle>
      <DialogContent className="grid gap-3">
        <TextField
          label="Title"
          placeholder="Enter column title"
          sx={{
            marginTop: 1,
          }}
          onChange={(e) => {
            setColumn((col) => {
              return { ...col, title: e.target.value };
            });
          }}
        />
        <div className="flex gap-2 items-center">
          <p className="text-lg font-semibold text-gray-500">Colors : </p>
          <div className="flex gap-2 items-center">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setColumn((col) => {
                    return { ...col, color: color };
                  });
                }}
              >
                <Circle
                  style={{
                    backgroundColor: color,
                    color: color,
                  }}
                  className={`rounded-full ${
                    color === column.color && "border-2 border-black"
                  }`}
                  size={24}
                />
              </button>
            ))}
          </div>
        </div>
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
