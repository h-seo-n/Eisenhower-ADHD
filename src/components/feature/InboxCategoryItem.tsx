import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Trash2, X } from 'lucide-react';
import type { CategoryTask, Task } from '../../types/task';
import { useTranslation } from 'react-i18next';
import styles from './InboxCategoryItem.module.css';

interface InboxCategoryProps {
  category: CategoryTask;
  subtasks: Task[];
  onAddSubtask: (category: CategoryTask, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
}

export default function InboxCategoryItem({
  category,
  subtasks,
  onAddSubtask,
  onDeleteTask,
  onSelectTask
}: InboxCategoryProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    onAddSubtask(category, inputVal);
    setInputVal('');
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggle}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={styles.chevron} />
        </motion.div>
        <span className={styles.label}>
          {category.text}
          <span className={styles.count}>
            ({subtasks.length})
          </span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.body}>
              <div className={styles.inputRow}>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                    placeholder={t('inbox.categoryPlaceholder')}
                    className={styles.input}
                  />
                  {inputVal && (
                    <button
                      onClick={() => setInputVal('')}
                      className={styles.clearButton}
                    >
                      <X className={styles.clearIcon} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleAdd}
                  className={styles.addButton}
                >
                  <Plus className={styles.addIcon} />
                </button>
              </div>

              <div className={styles.subtaskList}>
                {subtasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onSelectTask(task)}
                    className={styles.subtaskItem}
                  >
                    <div className={styles.subtaskTextWrap}>
                      <p className={styles.subtaskText}>{task.text}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className={styles.deleteButton}
                    >
                      <Trash2 className={styles.deleteIcon} />
                    </button>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}
