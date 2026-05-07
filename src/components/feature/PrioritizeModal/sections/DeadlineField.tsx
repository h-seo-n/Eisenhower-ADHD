import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DeadlineType } from '@/types/task';
import { toDatetimeLocalString, parseDatetimeLocal } from '@/utils/dateUtils';
import { useDeadlineLabels } from '@/hooks/useDeadlineLabels';
import styles from './sections.module.css';

const DEADLINE_OPTIONS: DeadlineType[] = ['Today', 'Tomorrow', 'Specific Date', 'No Deadline'];

interface DeadlineFieldProps {
  deadline: DeadlineType;
  specificDate: Date | null;
  onDeadlineChange: (value: DeadlineType) => void;
  onSpecificDateChange: (value: Date | null) => void;
  disabled?: boolean;
  labelKey?: string;
}

export default function DeadlineField({
  deadline,
  specificDate,
  onDeadlineChange,
  onSpecificDateChange,
  disabled,
  labelKey = 'prioritize.deadline',
}: DeadlineFieldProps) {
  const { t } = useTranslation();

  const deadlineLabels = useDeadlineLabels();

  return (
    <div>
      <label className={styles.fieldLabel}>
        <Calendar className={styles.iconSm} />
        {t(labelKey)}
      </label>
      <div className={styles.deadlineList}>
        {DEADLINE_OPTIONS.map((option) => (
          <label key={option} className={styles.deadlineOption}>
            <input
              type="radio"
              name="deadline"
              value={option}
              checked={deadline === option}
              onChange={(e) => onDeadlineChange(e.target.value as DeadlineType)}
              disabled={disabled}
              className={styles.radio}
            />
            <span className={styles.deadlineOptionLabel}>{deadlineLabels[option]}</span>
          </label>
        ))}
      </div>
      {deadline === 'Specific Date' && (
        <input
          type="datetime-local"
          value={toDatetimeLocalString(specificDate)}
          onChange={(e) => onSpecificDateChange(parseDatetimeLocal(e.target.value))}
          className={`${styles.input} ${styles.deadlineDate}`}
        />
      )}
    </div>
  );
}
