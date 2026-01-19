import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import type { CategoryTask, Task } from '../../types/task';
import PrioritizeModal from '../../components/feature/PrioritizeModal';
import InboxCategoryItem from '@/components/feature/InboxCategoryItem';

interface InboxProps {
  tasks: Task[];
  categories: CategoryTask[];
  onAddTask: (task: string | Task) => void;
  onAddSubtask: (category: CategoryTask, task: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onPrioritizeTask: (task: Task) => void;
  onPrioritizeCategory: (category: CategoryTask, subTasks: Task[]) => void;
}

export default function Inbox({ tasks, categories, onAddTask, onAddSubtask, onDeleteTask, onDeleteCategory, onPrioritizeTask, onPrioritizeCategory }: InboxProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddByEnter = () => {
    if (inputValue.trim()) {
      // on input + enter : (cannot make categories with this route)
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddByClick = () => {
          const task: Task = {
              id: crypto.randomUUID(),
              text: "",
              importance: 2,
              hours: 0,
              minutes: 30,
              deadline: 'Today',
              completed: false,
              createdAt: Date.now()
      };
      setSelectedTask(task);
      setInputValue('');

  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddByEnter();
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const inboxTasks = tasks.filter(t => (!t.quadrant && !t.superCategory));

  // category - inbox
  interface InboxCategory {
    category: CategoryTask;
    subtasks: Task[];
  }

  const inboxCategories: InboxCategory[] = categories.reduce<InboxCategory[]>((acc, category) => {
    const categroySubtasks = tasks.filter(t => t.superCategory?.id === category.id);
    const unassignedSubtasks = categroySubtasks.filter(t => !t.quadrant);

    if (unassignedSubtasks.length > 0) {
      acc.push({
        category: category,
        subtasks: unassignedSubtasks
      });
    }
    return acc;
  }, []);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Inbox</h1>
        <p className="text-teal-50 text-sm">Brain dump zone - capture everything</p>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Add a new thought..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleAddByClick}
            className="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {inboxTasks.length === 0 && inboxCategories.length === 0 && 
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No thoughts yet. Start adding!</p>
            </div>}
              
          {inboxCategories.map((catItem) => {
            const categoryFound = categories.find(c => c.id === catItem.category.id);
            console.log("category found:", categoryFound);
            return (
              <InboxCategoryItem
                  key={catItem.category.id}
                  category={categoryFound}
                  subtasks={catItem.subtasks}
                  onAddSubtask={onAddSubtask}
                  onDeleteTask={onDeleteTask}
                  onSelectTask={setSelectedTask}
              />                  
            );
          })}
            
          {inboxTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{task.text}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      <PrioritizeModal
        viewPage='Inbox'
        isOpen={!!selectedTask}
        onAddTask={onAddTask}
        onDeleteTask={onDeleteTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSaveTask={onPrioritizeTask}
        onSaveCategory={onPrioritizeCategory}
      />
    </div>
  );
}
