import { useState } from 'react';
import Modal from '../base/Modal';
import type { Task, DeadlineType } from '../../types/task';
import { calculateQuadrant } from '../../utils/taskCalculator';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface PrioritizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
}

export default function PrioritizeModal({ isOpen, onClose, task, onSave }: PrioritizeModalProps) {
  const [importance, setImportance] = useState(2);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [deadline, setDeadline] = useState<DeadlineType>('Today');
  const [specificDate, setSpecificDate] = useState('');

  const handleSave = () => {
    if (!task) return;

    const quadrant = calculateQuadrant(importance, deadline, specificDate);
    
    const updatedTask: Task = {
      ...task,
      importance,
      hours,
      minutes,
      deadline,
      specificDate: deadline === 'Specific Date' ? specificDate : undefined,
      quadrant
    };

    onSave(updatedTask);
    onClose();
  };

  const importanceLabels = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prioritize Task">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Importance Level
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="4"
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              {importanceLabels.map((label, index) => (
                <span
                  key={label}
                  className={importance === index + 1 ? 'font-semibold text-teal-600' : ''}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Estimated Duration
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="12"
                value={hours}
                onChange={(e) => setHours(Math.min(12, Math.max(0, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Deadline
          </label>
          <div className="space-y-2">
            {(['Today', 'Tomorrow', 'Specific Date', 'No Deadline'] as DeadlineType[]).map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="deadline"
                  value={option}
                  checked={deadline === option}
                  onChange={(e) => setDeadline(e.target.value as DeadlineType)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          
          {deadline === 'Specific Date' && (
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors whitespace-nowrap"
        >
          Save to Today
        </button>
      </div>
    </Modal>
  );
}
