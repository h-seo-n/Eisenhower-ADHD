import { PencilIcon, PinIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TaskTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  categoryLabel?: string;
}

export default function TaskTitleField({ value, onChange, categoryLabel }: TaskTitleFieldProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {categoryLabel && (
        <label className="block text-sm font-medium text-gray-900 flex items-center gap-4 mb-[-10px]">
          <PinIcon className="w-4 h-4" />
          {categoryLabel}
        </label>
      )}
      <div className="flex gap-3 items-center">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <PencilIcon className="w-4 h-4" />
        </label>
        <input
          type="text"
          placeholder={t('prioritize.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
}
