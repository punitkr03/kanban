import { Box, Paper, Stack, styled } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import KanbanColumn from "../types/kanbanColumnType";
import AddTaskDialog from "./AddTaskDialog";
import TaskDetails from "./TaskDetails";
import Task from "../types/taskType";
import AddColumnDialog from "./AddColumnDialog";
import { toast } from "sonner";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  transition: "all 0.2s ease",
}));

export default function Kanban() {
  const [columns, setColumns] = React.useState<KanbanColumn[]>(
    JSON.parse(localStorage.getItem("cols") as string) || [
      {
        id: 1,
        title: "Todo",
        color: "#ffcbd7",
        tasks: [
          {
            id: "1",
            title: "Item 1",
            status: "Todo",
            description: "Item 1 description",
          },
        ],
      },
      {
        id: 2,
        title: "In Progress",
        color: "#fce1a1",
        tasks: [
          {
            id: "2",
            title: "Item 2",
            status: "In Progress",
            description: "Item 2 description",
          },
          {
            id: "3",
            title: "Item 3",
            status: "In Progress",
            description: "Item 3 description",
          },
        ],
      },
      {
        id: 3,
        title: "Done",
        color: "#cce8e1",
        tasks: [
          {
            id: "4",
            title: "Item 4",
            status: "Done",
            description: "Item 4 description",
          },
        ],
      },
    ]
  );

  const [draggedTask, setDraggedTask] = React.useState<{
    taskId: string;
    sourceColumnId: number;
  } | null>(null);

  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = React.useState(false);
  const [taskDetailsDialogOpen, setTaskDetailsDialogOpen] =
    React.useState(false);
  const [targetTaskId, setTargetTaskId] = React.useState<string | null>(null);
  const [currentColumnId, setCurrentColumnId] = React.useState<number>(1);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const availableStatus = useMemo(
    () => columns.map((column) => column.title),
    [columns]
  );

  React.useEffect(() => {
    localStorage.setItem("cols", JSON.stringify(columns));
  }, [columns]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    sourceColumnId: number
  ) => {
    setDraggedTask({ taskId, sourceColumnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetColumnId: number) => {
      e.preventDefault();
      if (!draggedTask) return;

      const { taskId, sourceColumnId } = draggedTask;

      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const sourceColumn = newColumns.find(
          (col) => col.id === sourceColumnId
        );
        const targetColumn = newColumns.find(
          (col) => col.id === targetColumnId
        );
        const taskToMove = sourceColumn?.tasks.find(
          (task) => task.id === taskId
        );
        if (sourceColumn && targetColumn && taskToMove) {
          sourceColumn.tasks = sourceColumn.tasks.filter(
            (task) => task.id !== taskId
          );

          // Handle drops in empty target columns
          if (targetColumn.tasks.length === 0 || targetTaskId === undefined) {
            taskToMove.status = targetColumn.title;
            targetColumn.tasks.push(taskToMove);
          } else {
            const targetIndex = targetColumn.tasks.findIndex(
              (task) => task.id === targetTaskId
            );
            if (targetIndex !== -1) {
              taskToMove.status = targetColumn.title;
              targetColumn.tasks.splice(targetIndex, 0, taskToMove);
            } else {
              taskToMove.status = targetColumn.title;

              targetColumn.tasks.push(taskToMove);
            }
          }
        }
        return newColumns;
      });

      setDraggedTask(null);
    },
    [targetTaskId, draggedTask]
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailsDialogOpen(true);
  };

  const handleDeleteColumn = (columnTitle: string) => {
    if (columns.length <= 1) {
      toast.warning("Atleast 1 column is required.");
      return;
    }
    const newColumns = columns.filter((column) => column.title !== columnTitle);
    setColumns(newColumns);
  };
  return (
    <React.Fragment>
      <div className="py-3 w-full text-white text-center text-2xl font-medium bg-[#1769aa]">
        Kanban Board
        <button
          className="flex items-center text-black p-2 rounded bg-[#f2f2f2] hover:bg-[#e1e1e1] absolute right-4 top-3 text-sm gap-2"
          onClick={() => {
            setAddColumnDialogOpen(true);
          }}
        >
          <Plus size={16} />
          <span className="max-md:hidden">Add New Status</span>
        </button>
      </div>
      <div className="overflow-auto">
        <div className="flex">
          {columns &&
            columns.map((column) => (
              <Box
                key={column.id}
                sx={{
                  minWidth: 280,
                  backgroundColor: "#f2f2f2",
                  margin: 2,
                  borderRadius: "6px",
                  paddingBottom: 3,
                  minHeight: "fit-content",
                  position: "relative",
                  transition: "all 0.5s ease",
                }}
                onDragOver={(e) => e.preventDefault()} // Allow drag over event
                onDrop={(e) => {
                  handleDrop(e, column.id);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center my-3 ml-3 font-semibold">
                    <p
                      style={{ backgroundColor: column.color }}
                      className="px-1 rounded"
                    >
                      {column.title}
                    </p>
                    <p className="font-semibold text-gray-500">
                      {column.tasks.length}
                    </p>
                  </div>
                  <button
                    className="flex my-3 mr-3 rounded bg-[#f2f2f2] items-center h-fit p-2 hover:bg-[#e1e1e1]"
                    onClick={() => {
                      handleDeleteColumn(column.title);
                    }}
                  >
                    <Trash2 size={18} className="text-[#d83d31]" />
                  </button>
                </div>
                <Stack
                  spacing={2}
                  sx={{
                    width: "95%",
                    margin: "auto",
                  }}
                >
                  {column.tasks.length > 0 &&
                    column.tasks.map((task) => (
                      <Item
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          handleDragStart(e, task.id, column.id);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          setTargetTaskId(task.id);
                          handleDrop(e, column.id);
                        }}
                        onDragEnter={() => {
                          setTargetTaskId(task.id);
                        }}
                        onClick={() => {
                          setCurrentColumnId(column.id);
                          handleTaskClick(task);
                        }}
                        className="cursor-pointer"
                      >
                        {task.title}
                      </Item>
                    ))}
                  <button
                    className="flex items-center font-medium text-[#828181] hover:bg-[#e1e1e1] w-fit p-1 px-2 hover:rounded"
                    onClick={() => {
                      setAddTaskDialogOpen(true);
                      setCurrentColumnId(column.id);
                    }}
                  >
                    <Plus size={16} />
                    New
                  </button>
                </Stack>
              </Box>
            ))}
        </div>
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        open={addTaskDialogOpen}
        setAddTaskDialogOpen={setAddTaskDialogOpen}
        columnId={currentColumnId}
        columns={columns}
        setColumns={setColumns}
      />
      {selectedTask && (
        <TaskDetails
          open={taskDetailsDialogOpen}
          setTaskDetailsDialogOpen={setTaskDetailsDialogOpen}
          task={selectedTask}
          availableStatus={availableStatus}
          columnId={currentColumnId}
          setColumns={setColumns}
          columns={columns}
        />
      )}
      <AddColumnDialog
        open={addColumnDialogOpen}
        setAddTaskDialogOpen={setAddColumnDialogOpen}
        columns={columns}
        setColumns={setColumns}
        availableStatus={availableStatus}
      />
    </React.Fragment>
  );
}
