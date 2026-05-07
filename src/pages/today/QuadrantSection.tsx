import { Quadrant, Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { useTranslation } from "react-i18next";
import { getQuadrantInfo } from "@/utils/taskCalculator";
import { motion } from 'framer-motion';
import styles from './QuadrantSection.module.css';

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
      className={styles.section}
      style={{ backgroundColor: info.bg }}
    >
      <div className={styles.header}>
        <h2 className={styles.title} style={{ color: info.text }}>
          {t(`quadrant.${quadrant}.title`)}
        </h2>
        <p className={styles.subtitle} style={{ color: info.text }}>
          {t(`quadrant.${quadrant}.subtitle`)}
        </p>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>
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
