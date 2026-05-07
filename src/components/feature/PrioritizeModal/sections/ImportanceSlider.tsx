import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

interface ImportanceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labelKey?: string;
}

export default function ImportanceSlider({ value, onChange, disabled, labelKey = 'prioritize.importanceLevel' }: ImportanceSliderProps) {
  const { t } = useTranslation();
  const labels = [t('importance.low'), t('importance.medium'), t('importance.high'), t('importance.critical')];
  return (
    <div>
      <label className={styles.fieldLabel}>
        <AlertCircle className={styles.iconSm} />
        {t(labelKey)}
      </label>
      <div className={styles.sliderStack}>
        <input
          type="range"
          min="1"
          max="4"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          disabled={disabled}
        />
        <div className={styles.sliderLabels}>
          {labels.map((label, index) => (
            <span
              key={label}
              style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
              className={value === index + 1 ? styles.sliderLabelActive : ''}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
