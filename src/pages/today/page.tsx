import { useCallback, useState } from 'react';
import type { Task, Quadrant, CategoryTask } from '../../types/task';
import CelebrationModal from '../../components/feature/CelebrationModal';
import FocusTimer from '../../components/feature/FocusTimer';
import PrioritizeModal from '@/components/feature/PrioritizeModal';
import FloatingButton from '@/components/feature/FloatingButton';
import { useTranslation } from 'react-i18next';
import useCelebration from './celebration';
import QuadrantSection from './QuadrantSection';
import styles from './page.module.css';


interface TodayProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onStoreTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onCompleteWithTime: (id: string, actualHours: number, actualMinutes: number) => void;
  onPrioritizeTask: (task: Task) => void;
  onPrioritizeCategory: (category: CategoryTask, subTasks: Task[]) => void;
}

/* Constants */
const QUADRANTS: Quadrant[] = ['Q1', 'Q2', 'Q3', 'Q4'];

const DEFAULT_TASK_VALUES = {
  importance: 2,
  hours: 0,
  minutes: 15,
  deadline: 'Today',
} as const;

function createEmptyTask(): Task {
  return {
    id: crypto.randomUUID(),
    text: '',
    ...DEFAULT_TASK_VALUES,
    completed: false,
    createdAt: Date.now(),
  };
}

export default function Today({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onStoreTask,
  onCompleteWithTime,
  onPrioritizeTask,
  onPrioritizeCategory,
}: TodayProps) {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const { showCelebration, triggerCelebration, dismissCelebration } = useCelebration();

  const handleToggle = useCallback(
    (task: Task) => {
      if (task.quadrant === 'Q1' && !task.completed) {
        triggerCelebration();
      }
      onToggleComplete(task.id);
    },
    [onToggleComplete, triggerCelebration],
  );

  const handleTimerComplete = useCallback(
    (actualHours: number, actualMinutes: number) => {
      if (!timerTask) return;

      onCompleteWithTime(timerTask.id, actualHours, actualMinutes);
      triggerCelebration();
      setTimerTask(null);
    },
    [timerTask, onCompleteWithTime, triggerCelebration],
  );

  const handleOpenNewTask = useCallback(() => {
    setSelectedTask(createEmptyTask());
  }, []);

  const tasksByQuadrant = useCallback(
    (quadrant: Quadrant) =>
      tasks
        .filter((t) => t.quadrant === quadrant)
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasks],
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('today.title')}</h1>
        <p className={styles.subtitle}>{t('today.subtitle')}</p>
      </div>

      {/* Quadrant Grid */}
      <div className={styles.body}>
        <div className={styles.grid}>
          {QUADRANTS.map((quadrant) => (
            <QuadrantSection
              key={quadrant}
              quadrant={quadrant}
              tasks={tasksByQuadrant(quadrant)}
              onToggle={handleToggle}
              onSelect={setSelectedTask}
              onStartTimer={setTimerTask}
              onStore={onStoreTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </div>

      {/* FAB */}
      <div className={styles.fabWrapper}>
        <div className={styles.fabInner}>
          <FloatingButton onClick={handleOpenNewTask} />
        </div>
      </div>

      {/* Modals */}
      <CelebrationModal isOpen={showCelebration} onClose={dismissCelebration} />

      {selectedTask && (
        <PrioritizeModal
          onDeleteTask={onDeleteTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onSaveTask={onPrioritizeTask}
          onSaveCategory={onPrioritizeCategory}
        />
      )}

      {timerTask && (
        <FocusTimer
          isOpen={!!timerTask}
          onClose={() => setTimerTask(null)}
          task={timerTask}
          onComplete={handleTimerComplete}
        />
      )}
    </div>
  );
}
