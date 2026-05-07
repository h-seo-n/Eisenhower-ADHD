import { PencilIcon, PinIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

interface TaskTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  categoryLabel?: string;
  onEditCategory?: () => void;
}

export default function TaskTitleField({ value, onChange, categoryLabel, onEditCategory }: TaskTitleFieldProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.titleField}>
      {categoryLabel && (
        <div className={styles.titleCategory}>
          <PinIcon className={styles.iconSm} />
          <span>{categoryLabel}</span>
          {onEditCategory && (
            <button
              type="button"
              onClick={onEditCategory}
              className={styles.titleCategoryEdit}
              aria-label={t('prioritize.editCategory') || 'Edit category'}
            >
              <PencilIcon className={styles.iconSm} />
            </button>
          )}
        </div>
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
