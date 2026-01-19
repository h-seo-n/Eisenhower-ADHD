import { useState } from 'react';
import { Inbox as InboxIcon, Target, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { CategoryTask, Task } from '../../types/task';
import Inbox from '../inbox/page';
import Today from '../today/page';
import Stats from '../stats/page';

type TabType = 'inbox' | 'today' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [tasks, setTasks] = useLocalStorage<Task[]>('daily-focus-tasks', []);
  const [archivedTasks, setArchivedTasks] = useLocalStorage<Task[]>('archived-tasks', []);
  const [categoryTasks, setCategoryTasks] = useLocalStorage<CategoryTask[]>('super-category-tasks', []);

  const handleAddTask = (task: string | Task) => {
    if (typeof(task) === 'string'){
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: task,
      importance: 2,
      hours: 0,
      minutes: 30,
      deadline: 'Today',
      completed: false,
      createdAt: Date.now()
    };
    setTasks([...tasks, newTask]);
  } else {
    setTasks([...tasks, task])
  }
  };
  const handleAddCategorySubtask = (category: CategoryTask, text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text,
      superCategory: category, 
      importance: category.importance,
      hours: 0, 
      minutes: 30,
      deadline: category.deadline, 
      completed: false,
      createdAt: Date.now()
    };  
    setTasks(prev => [...prev, newTask]);
    setCategoryTasks(prev => prev.map(c => {
      if (c.id === category.id) {
        const currentSubtasks = c.subTasks || [];
        return {...c, subTasks: [...currentSubtasks, newTask] };
      }
      return c;
    }))
};

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDeleteCategoryTask = (id: string) => {
    const categoryToDelete = categoryTasks.find(c => c.id ===  id);
    if (!categoryToDelete) return;

    setCategoryTasks(prev => prev.filter(c => c.id !== id));
    setTasks(prevTasks => prevTasks.filter(t => t.superCategory?.id !== id));
  }

  const handleStoreTask = (id: string) => {
    const findTask = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setArchivedTasks(prev => [...prev, findTask]);
  }

  const handlePrioritizeTask = (inputTask: Task) => {
    // is it new task?
    const exists = tasks.some(t => t.id === inputTask.id);
    if (exists) {
      // existing task : edit
      setTasks(tasks.map(t => t.id === inputTask.id ? inputTask : t));
    } else {
      // new task : add automatically
      setTasks([...tasks, inputTask]);
    }
  };

  const handlePrioritizeCategory = (inputCategory: CategoryTask, subTasks: Task[], originalTaskId?: string) => {  
    setCategoryTasks(prev => {
      const exists = prev.some(c => c.id === inputCategory.id);
      
      // old: edit
      if (exists) return prev.map(c => c.id === inputCategory.id ? inputCategory : c);
      // new: add
      return [...prev, inputCategory];
    });

    setTasks(prevTasks => {
      let cleanedTasks = originalTaskId ? prevTasks.filter(t => t.id !== originalTaskId) : prevTasks

      cleanedTasks = cleanedTasks.filter(t => t.superCategory?.id !== inputCategory.id);
      return [...cleanedTasks, ...subTasks];
    })
  };

  const checkAndCompleteParent = (currentTasks: Task[], modifiedTaskId: string) => {
    const modifiedTask: Task = currentTasks.find(t => t.id === modifiedTaskId)
    const parentId = modifiedTask?.superCategory?.id;

    if (!parentId) return;
    
    // tasks belonging to same parent
    const siblings = currentTasks.filter(t => t.superCategory?.id === parentId);
    const allSubtasksComplete = siblings.every(t => t.completed);

    setCategoryTasks(prev => prev.map(category => {
      if (category.id === parentId) {
        if (category.completed !== allSubtasksComplete) {
          return {
            ...category,
            completed: allSubtasksComplete,
            completedAt: allSubtasksComplete ? Date.now() : undefined
          };
        }
      }
      return category;
    }))
  }

  const handleToggleComplete = (id: string) => {
    const newTasks = tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
        : t
    );
    setTasks(newTasks);
    checkAndCompleteParent(newTasks, id);
  };

  const handleCompleteWithTime = (id: string, actualHours: number, actualMinutes: number) => {
    const newTasks = tasks.map(t => 
        t.id === id 
          ? { ...t, completed: true, completedAt: Date.now(), actualHours, actualMinutes }
          : t
      );

    setTasks(newTasks);
    checkAndCompleteParent(newTasks, id);
};

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    return now.toLocaleDateString('en-US', options);
  };

  const tabs = [
    { id: 'inbox' as TabType, label: 'Inbox', icon: InboxIcon },
    { id: 'today' as TabType, label: 'Today', icon: Target },
    { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-xl relative">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-gray-900">My Daily Focus</h1>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{getCurrentDate()}</p>
          </div>
        </header>

        <main className="relative">
          {activeTab === 'inbox' && (
            <Inbox
              tasks={tasks}
              categories={categoryTasks}
              onAddTask={handleAddTask}
              onAddSubtask={handleAddCategorySubtask}
              onDeleteTask={handleDeleteTask}
              onDeleteCategory={handleDeleteCategoryTask}
              onPrioritizeTask={handlePrioritizeTask}
              onPrioritizeCategory={handlePrioritizeCategory}
            />
          )}
          {activeTab === 'today' && (
            <Today
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onDeleteCategory={handleDeleteCategoryTask}
              onStoreTask={handleStoreTask}
              onCompleteWithTime={handleCompleteWithTime}
              onPrioritizeTask={handlePrioritizeTask}
              onPrioritizeCategory={handlePrioritizeCategory}
            />
          )}
          {activeTab === 'stats' && <Stats tasks={tasks} archives={archivedTasks} />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-w-[480px] mx-auto flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-teal-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
