import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        {t(labelKey)}
      </label>
      <div className="space-y-2">
        <input
          type="range"
          min="1"
          max="4"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-gray-500">
          {labels.map((label, index) => (
            <span key={label} className={value === index + 1 ? 'font-semibold text-teal-600' : ''}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
