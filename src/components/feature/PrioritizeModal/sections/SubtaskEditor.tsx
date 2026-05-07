import { Clock, ListPlus, Plus, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../../../types/task';
import styles from './sections.module.css';

interface SubtaskEditorProps {
  subtaskInput: string;
  onSubtaskInputChange: (value: string) => void;
  subTasks: Task[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdateDuration: (id: string, hours: number, minutes: number) => void;
}

const parseClampedInt = (raw: string, min: number, max: number): number => {
  const val = parseInt(raw, 10);
  return Math.min(max, Math.max(min, isNaN(val) ? min : val));
};

export default function SubtaskEditor({
  subtaskInput,
  onSubtaskInputChange,
  subTasks,
  onAdd,
  onRemove,
  onUpdateDuration,
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
              <div className={styles.subtaskItemRight}>
                <div className={styles.subtaskDuration}>
                  <Clock className={styles.subtaskDurationIcon} />
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={sub.hours.toString()}
                    onChange={(e) =>
                      onUpdateDuration(sub.id, parseClampedInt(e.target.value, 0, 12), sub.minutes)
                    }
                    className={styles.subtaskDurationInput}
                    aria-label={t('common.hours')}
                  />
                  <span className={styles.subtaskDurationUnit}>h</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={sub.minutes.toString()}
                    onChange={(e) =>
                      onUpdateDuration(sub.id, sub.hours, parseClampedInt(e.target.value, 0, 59))
                    }
                    className={styles.subtaskDurationInput}
                    aria-label={t('common.minutes')}
                  />
                  <span className={styles.subtaskDurationUnit}>m</span>
                </div>
                <button
                  onClick={() => onRemove(sub.id)}
                  className={styles.subtaskRemove}
                  aria-label="Remove subtask"
                >
                  <Trash2 className={styles.subtaskRemoveIcon} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
