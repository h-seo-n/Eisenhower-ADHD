import { Quadrant, Task } from "@/types/task";
import IconButton from "./IconButton";
import { Archive, Play, Trash2 } from "lucide-react";
import styles from './TaskActions.module.css';

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
    <div className={styles.actions}>
      {showTimer && (
        <IconButton
          onClick={() => onStartTimer(task)}
          className={styles.timerButton}
          icon={<Play className={styles.icon} />}
        />
      )}
      {showArchive && (
        <IconButton
          onClick={() => onStore(task.id)}
          className={styles.archiveButton}
          icon={<Archive className={styles.icon} />}
        />
      )}
      <IconButton
        onClick={() => onDelete(task.id)}
        className={styles.deleteButton}
        icon={<Trash2 className={styles.icon} />}
      />
    </div>
  );
}

export default TaskActions;
