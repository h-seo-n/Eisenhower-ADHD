import { Quadrant, Task } from "@/types/task";
import TaskActions from "./TaskActions";
import { Clock } from "lucide-react";
import { Calendar } from "lucide-react";
import { useDeadlineLabels } from "@/hooks/useDeadlineLabels";
import styles from './TaskCard.module.css';

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
  const deadlineLabels = useDeadlineLabels();

  return (
    <div className={styles.card}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className={styles.checkbox}
        />

        {/* Task content */}
        <div className={styles.body} onClick={() => onSelect(task)}>
          {task.superCategory ? (
            <div>
              <p className={`${styles.categoryLabel} ${task.superCategory.completed ? styles.struck : ''}`}>
                {task.superCategory.text}
              </p>
              <p className={`${styles.taskText} ${task.completed ? styles.struck : ''}`}>
              {task.text}
              </p>
            </div>
          ) : (
          <p className={`${styles.taskText} ${task.completed ? styles.struck : ''}`}>
            {task.text}
          </p>
          )}
          <div className={styles.metaRow}>
            <span className={styles.meta}>
              <Clock width={16}/>
              {`${task.hours}h ${task.minutes}m`}
            </span>
            {task.deadline !== 'No Deadline' && (
              <span className={`${styles.meta} ${styles.metaDeadline}`}>
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
