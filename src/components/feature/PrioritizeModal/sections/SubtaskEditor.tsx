import { ListPlus, Plus, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../../../types/task';
import styles from './sections.module.css';

interface SubtaskEditorProps {
  subtaskInput: string;
  onSubtaskInputChange: (value: string) => void;
  subTasks: Task[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export default function SubtaskEditor({
  subtaskInput,
  onSubtaskInputChange,
  subTasks,
  onAdd,
  onRemove,
}: SubtaskEditorProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.subtaskWrap}>
      <label className={styles.fieldLabel}>
        <ListPlus className={styles.iconSm} />
        {t('prioritize.addSubtasks')}
      </label>
      <div className={styles.subtaskInputRow}>
        <div className={styles.subtaskInputWrap}>
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => onSubtaskInputChange(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && onAdd()}
            placeholder={t('prioritize.subtaskPlaceholder')}
            className={styles.subtaskInput}
          />
          {subtaskInput && (
            <button
              onClick={() => onSubtaskInputChange('')}
              className={styles.subtaskClear}
            >
              <X className={styles.subtaskClearIcon} />
            </button>
          )}
        </div>
        <button
          onClick={onAdd}
          className={styles.subtaskAdd}
        >
          <Plus className={styles.subtaskAddIcon} color="gray" />
        </button>
      </div>
      {subTasks.length > 0 && (
        <ul className={styles.subtaskList}>
          {subTasks.map((sub) => (
            <li key={sub.id} className={styles.subtaskItem}>
              <div className={styles.subtaskItemLeft}>
                <div className={styles.subtaskBullet} />
                <span className={styles.subtaskItemText}>{sub.text}</span>
              </div>
              <button
                onClick={() => onRemove(sub.id)}
                className={styles.subtaskRemove}
                aria-label="Remove subtask"
              >
                <Trash2 className={styles.subtaskRemoveIcon} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
