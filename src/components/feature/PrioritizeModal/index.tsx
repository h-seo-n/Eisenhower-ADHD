import Modal from '../../base/Modal';
import type { Task, CategoryTask } from '../../../types/task';
import { isTask } from '@/utils/typeGuards';
import { useTranslation } from 'react-i18next';
import { usePrioritizeForm } from './usePrioritizeForm';
import TaskTitleField from './sections/TaskTitleField';
import CategoryToggle from './sections/CategoryToggle';
import ImportanceSlider from './sections/ImportanceSlider';
import DurationField from './sections/DurationField';
import DeadlineField from './sections/DeadlineField';
import SubtaskEditor from './sections/SubtaskEditor';
import styles from './PrioritizeModal.module.css';

interface PrioritizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | CategoryTask | null;
  onDeleteTask: (id: string) => void;
  onSaveTask: (task: Task) => void;
  onSaveCategory: (category: CategoryTask, subTasks: Task[], originalTaskId: string) => void;
  viewPage: 'Inbox' | 'Today';
}

export default function PrioritizeModal({ isOpen, onClose, task, onSaveTask, onSaveCategory, viewPage }: PrioritizeModalProps) {
  const { t } = useTranslation();
  const isSubtask = Boolean(isTask(task) && task.superCategory);

  const form = usePrioritizeForm({ task, onSaveTask, onSaveCategory, onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('prioritize.title')}>
      <div className={styles.form}>
        <TaskTitleField
          value={form.content}
          onChange={form.setContent}
          categoryLabel={isSubtask ? (task as Task).superCategory?.text : undefined}
        />

        {viewPage === 'Inbox' && isTask(task) && !task.superCategory && (
          <CategoryToggle
            checked={form.isCategoryTask}
            onChange={form.setIsCategoryTask}
          />
        )}

        <ImportanceSlider
          value={form.importance}
          onChange={form.setImportance}
          disabled={isSubtask}
          labelKey={isSubtask ? 'prioritize.categoryImportanceLevel' : 'prioritize.importanceLevel'}
        />

        {!form.isCategoryTask && (
          <DurationField
            hours={form.hours}
            minutes={form.minutes}
            onHoursChange={form.setHours}
            onMinutesChange={form.setMinutes}
          />
        )}

        <DeadlineField
          deadline={form.deadline}
          specificDate={form.specificDate}
          onDeadlineChange={form.setDeadline}
          onSpecificDateChange={form.setSpecificDate}
          disabled={isSubtask}
          labelKey={isSubtask ? 'prioritize.categoryDeadline' : 'prioritize.deadline'}
        />

        {form.isCategoryTask && !isSubtask && (
          <SubtaskEditor
            subtaskInput={form.subtaskInput}
            onSubtaskInputChange={form.setSubtaskInput}
            subTasks={form.subTasksDraft}
            onAdd={form.handleAddSubtask}
            onRemove={form.handleRemoveSubtask}
          />
        )}

        <button
          onClick={form.handleSave}
          className={styles.saveButton}
        >
          {t('prioritize.saveToToday')}
        </button>
      </div>
    </Modal>
  );
}
