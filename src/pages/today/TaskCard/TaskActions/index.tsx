import { Quadrant, Task } from "@/types/task";
import IconButton from "./IconButton";
import { Archive, Play, Trash2 } from "lucide-react";

interface TaskActionsProps {
  task: Task;
  quadrant: Quadrant;
  onStartTimer: (task: Task) => void;
  onStore: (id: string) => void;
  onDelete: (id: string) => void;
}


function TaskActions({ task, quadrant, onStartTimer, onStore, onDelete }: TaskActionsProps) {
  const showTimer = quadrant === 'Q1' && !task.completed;
  const showArchive = task.completed;

  return (
    <div className="flex items-start gap-2 flex-shrink-0">
      {showTimer && (
        <IconButton
          onClick={() => onStartTimer(task)}
          className="text-teal-500 hover:bg-teal-50"
          icon={<Play className="w-4 h-4" />}
        />
      )}
      {showArchive && (
        <IconButton
          onClick={() => onStore(task.id)}
          className="text-gray-400 hover:text-zinc-500 hover:bg-zinc-50"
          icon={<Archive className="w-4 h-4" />}
        />
      )}
      <IconButton
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-400 hover:bg-zinc-50"
        icon={<Trash2 className="w-4 h-4" />}
      />
    </div>
  );
}

export default TaskActions;