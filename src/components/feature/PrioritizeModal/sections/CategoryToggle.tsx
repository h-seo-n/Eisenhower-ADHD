import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

interface CategoryToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CategoryToggle({ checked, onChange }: CategoryToggleProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.toggleRow}>
      <input
        type="checkbox"
        id="subtask"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkbox}
      />
      <label htmlFor="subtask" className={styles.toggleLabel}>
        {t('prioritize.divideToSubtasks')}
      </label>
    </div>
  );
}
