import { PencilIcon, PinIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

interface TaskTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  categoryLabel?: string;
}

export default function TaskTitleField({ value, onChange, categoryLabel }: TaskTitleFieldProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.titleField}>
      {categoryLabel && (
        <label className={styles.titleCategory}>
          <PinIcon className={styles.iconSm} />
          {categoryLabel}
        </label>
      )}
      <div className={styles.titleRow}>
        <label className={styles.titleEditIcon}>
          <PencilIcon className={styles.iconSm} />
        </label>
        <input
          type="text"
          placeholder={t('prioritize.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
        />
      </div>
    </div>
  );
}
