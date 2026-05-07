import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import type { CategoryTask, Task } from '../../types/task';
import PrioritizeModal from '../../components/feature/PrioritizeModal';
import InboxCategoryItem from '@/components/feature/InboxCategoryItem';
import FloatingButton from '@/components/feature/FloatingButton';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

interface InboxProps {
  tasks: Task[];
  categories: CategoryTask[];
  onAddTask: (task: string | Task) => void;
  onAddSubtask: (category: CategoryTask, task: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onPrioritizeTask: (task: Task) => void;
  onPrioritizeCategory: (category: CategoryTask, subTasks: Task[]) => void;
}

export default function Inbox({ tasks, categories, onAddTask, onAddSubtask, onDeleteTask, onDeleteCategory, onPrioritizeTask, onPrioritizeCategory }: InboxProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddByEnter = () => {
    if (inputValue.trim()) {
      // on input + enter : (cannot make categories with this route)
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddByEnter();
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const inboxTasks = tasks.filter(t => (!t.quadrant && !t.superCategory));

  // category - inbox
  interface InboxCategory {
    category: CategoryTask;
    subtasks: Task[];
  }

  const inboxCategories: InboxCategory[] = categories.reduce<InboxCategory[]>((acc, category) => {
    const categroySubtasks = tasks.filter(t => t.superCategory?.id === category.id);
    const unassignedSubtasks = categroySubtasks.filter(t => !t.quadrant);

    if (unassignedSubtasks.length > 0) {
      acc.push({
        category: category,
        subtasks: unassignedSubtasks
      });
    }
    return acc;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('inbox.title')}</h1>
        <p className={styles.subtitle}>{t('inbox.subtitle')}</p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder={t('inbox.placeholder')}
              className={styles.input}
            />
            {inputValue && (
              <button onClick={handleClear} className={styles.clearButton}>
                <X className={styles.clearIcon} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.list}>
          {inboxTasks.length === 0 && inboxCategories.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyText}>{t('inbox.empty')}</p>
            </div>
          )}

          {inboxCategories.map((catItem) => {
            const categoryFound = categories.find(c => c.id === catItem.category.id);
            console.log("category found:", categoryFound);
            return (
              <InboxCategoryItem
                  key={catItem.category.id}
                  category={categoryFound}
                  subtasks={catItem.subtasks}
                  onAddSubtask={onAddSubtask}
                  onDeleteTask={onDeleteTask}
                  onSelectTask={setSelectedTask}
              />
            );
          })}

          {inboxTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.taskCard}
                onClick={() => setSelectedTask(task)}
              >
                <div className={styles.taskRow}>
                  <div className={styles.taskTextWrapper}>
                    <p className={styles.taskText}>{task.text}</p>
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
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      <div className={styles.fabWrapper}>
        <div className={styles.fabInner}>
          <FloatingButton
            onClick={() => {
              const newTask: Task = {
                id: crypto.randomUUID(),
                text: "",
                importance: 2,
                hours: 0,
                minutes: 15,
                deadline: 'Today',
                completed: false,
                createdAt: Date.now()
              };
              setSelectedTask(newTask);
            }}
            className={styles.fabButton}
          />
        </div>
      </div>

      <PrioritizeModal
        viewPage='Inbox'
        isOpen={!!selectedTask}
        onDeleteTask={onDeleteTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSaveTask={onPrioritizeTask}
        onSaveCategory={onPrioritizeCategory}
      />

    </div>
  );
}
