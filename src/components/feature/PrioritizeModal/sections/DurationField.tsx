import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {t('prioritize.estimatedDuration')}
      </label>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('common.hours')}</label>
          <input
            type="number"
            min="0"
            max="12"
            value={hours.toString()}
            onChange={(e) => onHoursChange(parseClampedInt(e.target.value, 0, 12))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('common.minutes')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => onMinutesChange(parseClampedInt(e.target.value, 0, 59))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}
