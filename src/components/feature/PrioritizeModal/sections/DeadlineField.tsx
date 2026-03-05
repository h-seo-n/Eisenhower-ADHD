import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DeadlineType } from '../../../../types/task';
import { toDatetimeLocalString } from '../../../../utils/dateUtils';

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

  const deadlineLabels: Record<DeadlineType, string> = {
    Today: t('deadline.today'),
    Tomorrow: t('deadline.tomorrow'),
    'Specific Date': t('deadline.specificDate'),
    'No Deadline': t('deadline.noDeadline'),
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {t(labelKey)}
      </label>
      <div className="space-y-2">
        {DEADLINE_OPTIONS.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="deadline"
              value={option}
              checked={deadline === option}
              onChange={(e) => onDeadlineChange(e.target.value as DeadlineType)}
              disabled={disabled}
              className="w-4 h-4 text-teal-500 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{deadlineLabels[option]}</span>
          </label>
        ))}
      </div>
      {deadline === 'Specific Date' && (
        <input
          type="datetime-local"
          value={toDatetimeLocalString(specificDate)}
          onChange={(e) => onSpecificDateChange(e.target.value ? new Date(e.target.value) : null)}
          className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
        />
      )}
    </div>
  );
}
