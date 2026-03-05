import { ListPlus, Plus, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../../../types/task';

interface SubtaskEditorProps {
  subtaskInput: string;
  onSubtaskInputChange: (value: string) => void;
  subTasks: Task[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export default function SubtaskEditor({
  subtaskInput,
  onSubtaskInputChange,
  subTasks,
  onAdd,
  onRemove,
}: SubtaskEditorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <ListPlus className="w-4 h-4" />
        {t('prioritize.addSubtasks')}
      </label>
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => onSubtaskInputChange(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && onAdd()}
            placeholder={t('prioritize.subtaskPlaceholder')}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          {subtaskInput && (
            <button
              onClick={() => onSubtaskInputChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onAdd}
          className="w-5 h-5 flex items-center justify-center text-teal rounded-xl whitespace-nowrap"
        >
          <Plus className="w-4 h-4" color="gray" />
        </button>
      </div>
      {subTasks.length > 0 && (
        <ul className="space-y-2 mt-2">
          {subTasks.map((sub) => (
            <li key={sub.id} className="group flex items-center justify-between p-2 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{sub.text}</span>
              </div>
              <button
                onClick={() => onRemove(sub.id)}
                className="items-center text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove subtask"
              >
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
