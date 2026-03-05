import { Quadrant, Task } from "@/types/task";
import TaskActions from "./TaskActions";
import { Clock } from "lucide-react";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  quadrant: Quadrant;
  onToggle: (task: Task) => void;
  onSelect: (task: Task) => void;
  onStartTimer: (task: Task) => void;
  onStore: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, quadrant, onToggle, onSelect, onStartTimer, onStore, onDelete }: TaskCardProps) {
  const completedClass = task.completed ? 'line-through opacity-50' : '';

  return (
    <div className="bg-white rounded-lg p-3 md:p-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0"
        />

        <div className="flex-1 min-w-0" onClick={() => onSelect(task)}>
          {task.superCategory && (
            <p className={`text-[12px] md:text-[11px] text-gray-500 ${task.superCategory.completed ? 'line-through opacity-50' : ''}`}>
              {task.superCategory.text}
            </p>
          )}
          <p className={`text-sm md:text-[13px] text-gray-900 ${completedClass}`}>
            {task.text}
          </p>
        </div>

        <div className="flex items-center justify-end gap-5 mt-2">
          <span className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Clock />
            {`${task.hours}h ${task.minutes}m`}
          </span>
          {(task.deadline === 'No Deadline' || task.deadline === 'Specific Date') && (
            <span className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Calendar />
              {task.deadline === 'Specific Date' && task.specificDate
                ? (task.specificDate instanceof Date ? task.specificDate : new Date(task.specificDate)).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : task.deadline}
            </span>
          )}
        </div>
      </div>


        <TaskActions
          task={task}
          quadrant={quadrant}
          onStartTimer={onStartTimer}
          onStore={onStore}
          onDelete={onDelete}
        />
      </div>
  );
}

export default TaskCard;
