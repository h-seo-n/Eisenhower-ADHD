import { Quadrant, Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { useTranslation } from "react-i18next";
import { getQuadrantInfo } from "@/utils/taskCalculator";
import { motion } from 'framer-motion';

interface QuadrantSectionProps {
  quadrant: Quadrant;
  tasks: Task[];
  onToggle: (task: Task) => void;
  onSelect: (task: Task) => void;
  onStartTimer: (task: Task) => void;
  onStore: (id: string) => void;
  onDelete: (id: string) => void;
}

function QuadrantSection({ quadrant, tasks, onToggle, onSelect, onStartTimer, onStore, onDelete }: QuadrantSectionProps) {
  const { t } = useTranslation();
  const info = getQuadrantInfo(quadrant);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${info.color} ${info.borderColor} border-2 rounded-2xl p-4 min-h-[200px]`}
    >
      <div className="mb-4">
        <h2 className={`text-lg font-bold ${info.textColor}`}>
          {t(`quadrant.${quadrant}.title`)}
        </h2>
        <p className={`text-xs ${info.textColor} opacity-70`}>
          {t(`quadrant.${quadrant}.subtitle`)}
        </p>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-4">
            {t('today.noTasks')}
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              quadrant={quadrant}
              onToggle={onToggle}
              onSelect={onSelect}
              onStartTimer={onStartTimer}
              onStore={onStore}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default QuadrantSection;