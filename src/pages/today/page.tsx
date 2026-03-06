import { useCallback, useState } from 'react';
import type { Task, Quadrant, CategoryTask } from '../../types/task';
import CelebrationModal from '../../components/feature/CelebrationModal';
import FocusTimer from '../../components/feature/FocusTimer';
import PrioritizeModal from '@/components/feature/PrioritizeModal';
import FloatingButton from '@/components/feature/FloatingButton';
import { useTranslation } from 'react-i18next';
import useCelebration from './celebration';
import QuadrantSection from './QuadrantSection';


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
    (quadrant: Quadrant) => tasks.filter((t) => t.quadrant === quadrant),
    [tasks],
  );

  return (
    <div className="pb-20 relative">
      {/* Header */}
      <div className="bg-[#073B4C] text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">{t('today.title')}</h1>
        <p className="text-slate-300 text-sm">{t('today.subtitle')}</p>
      </div>

      {/* Quadrant Grid */}
      <div className="p-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
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
      <div className="fixed bottom-[calc(5rem+1.5rem)] left-0 right-0 mx-auto w-full max-w-md px-6 pointer-events-none z-50">
        <div className="flex justify-end pointer-events-auto">
          <FloatingButton onClick={handleOpenNewTask} />
        </div>
      </div>

      {/* Modals */}
      <CelebrationModal isOpen={showCelebration} onClose={dismissCelebration} />

      {selectedTask && (
        <PrioritizeModal
          viewPage="Today"
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
