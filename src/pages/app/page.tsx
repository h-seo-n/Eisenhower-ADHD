import { useState } from 'react';
import { Inbox as InboxIcon, Target, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Task } from '../../types/task';
import Inbox from '../inbox/page';
import Today from '../today/page';
import Stats from '../stats/page';

type TabType = 'inbox' | 'today' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [tasks, setTasks] = useLocalStorage<Task[]>('daily-focus-tasks', []);

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      importance: 2,
      hours: 0,
      minutes: 30,
      deadline: 'Today',
      completed: false,
      createdAt: Date.now()
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handlePrioritizeTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
        : t
    ));
  };

  const handleCompleteWithTime = (id: string, actualHours: number, actualMinutes: number) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, completed: true, completedAt: Date.now(), actualHours, actualMinutes }
        : t
    ));
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
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onPrioritizeTask={handlePrioritizeTask}
            />
          )}
          {activeTab === 'today' && (
            <Today
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onCompleteWithTime={handleCompleteWithTime}
            />
          )}
          {activeTab === 'stats' && <Stats tasks={tasks} />}
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
