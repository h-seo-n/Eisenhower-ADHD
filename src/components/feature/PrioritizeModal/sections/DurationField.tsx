import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

interface DurationFieldProps {
  hours: number;
  minutes: number;
  onHoursChange: (value: number) => void;
  onMinutesChange: (value: number) => void;
}

export default function DurationField({ hours, minutes, onHoursChange, onMinutesChange }: DurationFieldProps) {
  const { t } = useTranslation();

  const parseClampedInt = (raw: string, min: number, max: number): number => {
    const val = parseInt(raw, 10);
    return Math.min(max, Math.max(min, isNaN(val) ? min : val));
  };

  return (
    <div>
      <label className={styles.fieldLabel}>
        <Clock className={styles.iconSm} />
        {t('prioritize.estimatedDuration')}
      </label>
      <div className={styles.durationRow}>
        <div className={styles.durationField}>
          <label className={styles.durationHint}>{t('common.hours')}</label>
          <input
            type="number"
            min="0"
            max="12"
            value={hours.toString()}
            onChange={(e) => onHoursChange(parseClampedInt(e.target.value, 0, 12))}
            className={styles.input}
          />
        </div>
        <div className={styles.durationField}>
          <label className={styles.durationHint}>{t('common.minutes')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => onMinutesChange(parseClampedInt(e.target.value, 0, 59))}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}
