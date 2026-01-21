import { useEffect, useState } from 'react';
import Modal from '../base/Modal';
import type { Task, DeadlineType, CategoryTask } from '../../types/task';
import { calculateTaskQuadrant } from '../../utils/taskCalculator';
import { Calendar, Clock, AlertCircle, PencilIcon, ListPlus, X, Plus, Trash2, PinIcon } from 'lucide-react';
import { isTask } from '@/utils/typeGuards';

interface PrioritizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | CategoryTask | null;
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSaveTask: (task: Task) => void;
  onSaveCategory: (category: CategoryTask, subTasks: Task[], originalTaskId: string) => void;
  viewPage: "Inbox" | "Today";
}

export default function PrioritizeModal({ isOpen, onClose, task, onAddTask, onDeleteTask, onSaveTask, onSaveCategory, viewPage }: PrioritizeModalProps) {
  const isEditingCategory = task ? !isTask(task) : false;
  const [content, setContent] = useState<string>(task?.text || "");
  const [importance, setImportance] = useState<number>(task?.importance || 2);
  const [hours, setHours] = useState<number>(isTask(task) ? task.hours : 0);
  const [minutes, setMinutes] = useState<number>(isTask(task) ? task.minutes : 30);
  const [deadline, setDeadline] = useState<DeadlineType>(task?.deadline || 'Today');
  const [specificDate, setSpecificDate] = useState<string>(task?.specificDate || '');
  
  const [isCategoryTask, setIsCategoryTask] = useState<boolean>(isEditingCategory);
  const [subtaskInput, setSubtaskInput] = useState<string>('');
  const [subTasksDraft, setSubtasksDraft] = useState<Task[]>([]);

  useEffect(() => {
    const categoryMode = task ? !isTask(task) : false;
    setIsCategoryTask(categoryMode);

    if (task && !isTask(task) && task.subTasks) {
      setSubtasksDraft(task.subTasks.map(st => ({...st})));
    } else {
      setSubtasksDraft([]);
    }

    setContent(task?.text || "");
    setImportance(task?.importance || 2);
    setHours(isTask(task) ? task.hours : 0);
    setMinutes(isTask(task) ? task.minutes : 30);
    setDeadline(task?.deadline || 'Today');
    setSpecificDate(task?.specificDate || '');
  }, [task]);

  const handleAddSubtaskItem = () => {
    if (subtaskInput.trim()) {

      const newSubtask: Task = {
      id: crypto.randomUUID(), // Generate ID immediately
      text: subtaskInput,
      importance,
      hours: 0,
      minutes: 30,
      deadline: deadline || 'Today',
      completed: false,
      createdAt: Date.now(),
    };
    setSubtasksDraft([...subTasksDraft, newSubtask]);
    setSubtaskInput('');
  }}

  const handleRemoveSubtaskItem = (taskId: string) => {
    setSubtasksDraft(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSave = () => {
    if (!task) return;
    setSubtaskInput('');
    // if it is a category task :
    if (isCategoryTask) {
      const categoryId = (task && !isTask(task)) ? task.id : crypto.randomUUID();
      const existingCategory = (task && !isTask(task)) ? task : null;
      
      const shallowCategory: CategoryTask = {
        id: categoryId,
        text: content,
        importance,
        deadline,
        specificDate: deadline === 'Specific Date' ? specificDate : undefined,
        subTasks: [],
        completed: existingCategory ? existingCategory.completed : false,
        createdAt: existingCategory ? existingCategory.createdAt : Date.now(),
      };

      const subTaskList: Task[] = subTasksDraft.map((s) => ({
          ...s,
          superCategory: shallowCategory,
        }));

      const updatedCategory: CategoryTask = {
        ...shallowCategory,
        subTasks: subTaskList,
      }

      // if it was originally added as a task, find it and delete it
      // if (task && isTask(task)) {
      //   onDeleteTask(task.id);
      // }
      // save category and subtasks
      const originalTaskId = (task && isTask(task)) ? task.id : undefined;
      onSaveCategory(updatedCategory, subTaskList, originalTaskId);

      onClose();
    } else {
      const draftTask = {
        id: task?.id || crypto.randomUUID(),
        ...(task || {}),
        text: content,
        importance,
        hours,
        minutes,
        deadline,
        specificDate: deadline === 'Specific Date' ? specificDate : undefined,
        createdAt: task ? task.createdAt : Date.now(),
        completed: task ? task.completed : false,
      } as Task;

      // else, it is a regular task:
      const quadrant = calculateTaskQuadrant(draftTask);
      
      const updatedTask: Task = {
        ...draftTask,
        quadrant
      };

      onSaveTask(updatedTask);
      onClose();
    }
  };

  const isSubtask: boolean = Boolean(isTask(task) && task.superCategory);
  const importanceLabels = ['Low', 'Medium', 'High', 'Critical'];
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prioritize Task">
      <div className="space-y-6">
      {isSubtask && (
        <div>
          {/* Category label */}
            <label className="block text-sm font-medium text-gray-900 flex items-center gap-4 mb-[-10px]">
              <PinIcon className="w-4 h-4" />
                {(task as Task)?.superCategory?.text}
            </label>
        </div>
      )}
      <div className="flex gap-3 items-center">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <PencilIcon className='w-4 h-4' />
          </label>
              <input
              type="text"
              placeholder='write your task'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"

            />
        </div>

        {/* Ask if it is a category - shown for non-subtasjs */}
        {viewPage==="Inbox" && isTask(task) && !task.superCategory &&
        <div className='flex gap-3'>
            <input
              type="checkbox" 
              id='subtask'
              checked={isCategoryTask}
              onChange={()=>setIsCategoryTask(t => !t)}
              className='w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0 items-center'
            />
            <label htmlFor='subtask' className='text-sm font-medium text-gray-700 gap-2'>Divide to subtasks</label>
          <hr />
        </div>
        }
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {isSubtask ? "Category Importance Level": "Importance Level"}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="4"
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              disabled={isSubtask}
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

        {!isCategoryTask && <div>
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
                value={hours.toString()}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const cleanValue = isNaN(val) ? 0 : val;
                  setHours(Math.min(12, Math.max(0, cleanValue)));
                }}
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
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const cleanValue = isNaN(val) ? 0 : val;
                  setMinutes(Math.min(59, Math.max(0, cleanValue)));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {isSubtask ? "Category Deadline" : "Deadline"}
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
                  disabled={isSubtask}
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
        {/* Subtask areas */}
        {isCategoryTask && !(isSubtask) && 
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <ListPlus className="w-4 h-4" />
            Add Subtasks
          </label>
          <div className='flex gap-2 items-center'>
            <div className='flex-1 relative'>
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyUp={(e)=> (e.key === 'Enter') && handleAddSubtaskItem() }
                placeholder="Add a new subtask..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              {subtaskInput && (
                <button
                  onClick={()=>setSubtaskInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
              <button
                onClick={()=>handleAddSubtaskItem()}
                className="w-5 h-5 flex items-center justify-center text-teal rounded-xl whitespace-nowrap"
              >
                <Plus className="w-4 h-4" color='gray'/>
              </button>
          </div>
          {/* show added substasks */}
          <div>
            {subTasksDraft?.length > 0 && 
              <ul className="space-y-2 mt-2">
              {subTasksDraft.map((sub) => (
              <li 
                key={sub.id} 
                className="group flex items-center justify-between p-2 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{sub.text}</span>
                </div>
                {/* remove subtasks */}
                <button
                  onClick={() => handleRemoveSubtaskItem(sub.id)}
                  className="items-center text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove subtask"
                >
                  <Trash2 className='w-4 h-4 text-gray-400' />
                </button>
              </li>
              ))}
              </ul>
            }
          </div>
        </div>
        }

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
