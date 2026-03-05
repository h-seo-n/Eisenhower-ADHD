import { Quadrant, Task } from "@/types/task";
import TaskActions from "./TaskActions";
import { Clock } from "lucide-react";
import { Calendar } from "lucide-react";
import { useDeadlineLabels } from "@/hooks/useDeadlineLabels";

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

  const deadlineLabels = useDeadlineLabels();

  return (
    <div className="flex items-start gap-4 bg-white rounded-lg px-5 py-4 shadow-sm border border-gray-100">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0"
        />

        {/* Task content */}
        <div className="flex flex-wrap items-start justify-between flex-1 min-w-0 gap-y-2 gap-x-3" onClick={() => onSelect(task)}>
          {task.superCategory ? (
            <p className={`max-w-full text-[12px] md:text-[11px] text-gray-500 break-words ${task.superCategory.completed ? 'line-through opacity-50' : ''}`}>
              {task.superCategory.text}
            </p>
          ) : (
          <p className={`max-w-full break-words text-sm md:text-[13px] text-gray-900 ${completedClass}`}>
            {task.text}
          </p>
          )}
          <div className="flex items-center justify-end gap-3 flex-1">
            <span className="flex flex-nowrap whitespace-nowrap items-center gap-1 text-gray-400 text-sm">
              <Clock width={16}/>
              {`${task.hours}h ${task.minutes}m`}
            </span>
            {task.deadline !== 'No Deadline' && (
              <span className="flex items-center flex-nowrap whitespace-nowrap gap-1.5 text-gray-400 text-sm">
                <Calendar width={16}/>
                {task.deadline === 'Specific Date' && task.specificDate
                  ? (task.specificDate instanceof Date ? task.specificDate : new Date(task.specificDate)).toLocaleString([], { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : deadlineLabels[task.deadline]}
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
