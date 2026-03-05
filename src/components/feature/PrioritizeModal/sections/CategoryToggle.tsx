import { useTranslation } from 'react-i18next';

interface CategoryToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CategoryToggle({ checked, onChange }: CategoryToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <input
        type="checkbox"
        id="subtask"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0 items-center"
      />
      <label htmlFor="subtask" className="text-sm font-medium text-gray-700 gap-2">
        {t('prioritize.divideToSubtasks')}
      </label>
    </div>
  );
}
