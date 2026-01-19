import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Trash2, X } from 'lucide-react';
import type { CategoryTask, Task } from '../../types/task';

interface InboxCategoryProps {
  category: CategoryTask;
  subtasks: Task[];
  onAddSubtask: (category: CategoryTask, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
}

export default function InboxCategoryItem({ 
  category,
  subtasks, 
  onAddSubtask, 
  onDeleteTask, 
  onSelectTask 
}: InboxCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    onAddSubtask(category, inputVal);
    setInputVal('');
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      {/* --- accordion header --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-4 hover:bg-gray-100 transition-colors text-left"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </motion.div>
        <span className="font-medium text-gray-700 text-sm">
          {category.text}
          <span className="ml-2 text-xs text-gray-400 font-normal">
            ({subtasks.length})
          </span>
        </span>
      </button>

      {/* --- accordion body --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 space-y-3">
              
              {/* input box (top of list) */}
              <div className="flex gap-2 items-center pl-7">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                    placeholder="Add task to this category..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  />
                  {inputVal && (
                    <button
                      onClick={() => setInputVal('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-9 h-9 flex items-center justify-center bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Subtask List */}
              <div className="space-y-2 pl-7">
                {subtasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onSelectTask(task)}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm truncate">{task.text}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}