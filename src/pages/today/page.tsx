import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Play, Archive } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Quadrant, CategoryTask } from '../../types/task';
import { getQuadrantInfo } from '../../utils/taskCalculator';
import CelebrationModal from '../../components/feature/CelebrationModal';
import FocusTimer from '../../components/feature/FocusTimer';
import PrioritizeModal from '@/components/feature/PrioritizeModal';
import FloatingButton from '@/components/feature/FloatingButton';

interface TodayProps {
  tasks: Task[];
  onAddTask: (task: string | Task) => void;
  onToggleComplete: (id: string) => void;
  onStoreTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onCompleteWithTime: (id: string, actualHours: number, actualMinutes: number) => void;
  onPrioritizeTask: (task: Task) => void;
  onPrioritizeCategory: (category: CategoryTask, subTasks: Task[]) => void;
}

export default function Today({ tasks, onAddTask, onToggleComplete, onDeleteTask, onDeleteCategory, onStoreTask, onCompleteWithTime, onPrioritizeTask, onPrioritizeCategory }: TodayProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timerTask, setTimerTask] = useState<Task | null>(null);

  const handleToggle = (task: Task) => {
    if (task.quadrant === 'Q1' && !task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      setShowCelebration(true);
    }
    
    onToggleComplete(task.id);
  };

  const handleStartTimer = (task: Task) => {
    setTimerTask(task);
  };

  const handleTimerComplete = (actualHours: number, actualMinutes: number) => {
    if (timerTask) {
      onCompleteWithTime(timerTask.id, actualHours, actualMinutes);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      setShowCelebration(true);
      setTimerTask(null);
    }
  };

  const quadrants: Quadrant[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  const getTasksByQuadrant = (quadrant: Quadrant) => {
    return tasks.filter(t => t.quadrant === quadrant);
  };

  return (
    <div className="pb-20 relative">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Today&apos;s Focus</h1>
        <p className="text-slate-300 text-sm">Eisenhower Matrix</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((quadrant) => {
            const info = getQuadrantInfo(quadrant);
            const quadrantTasks = getTasksByQuadrant(quadrant);
            
            return (
              <motion.div
                key={quadrant}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${info.color} ${info.borderColor} border-2 rounded-2xl p-4 min-h-[200px]`}
              >
                <div className="mb-4">
                  <h2 className={`text-lg font-bold ${info.textColor}`}>{info.title}</h2>
                  <p className={`text-xs ${info.textColor} opacity-70`}>{info.subtitle}</p>
                </div>

                <div className="space-y-2">
                  {quadrantTasks.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4">No tasks</p>
                  ) : (
                    quadrantTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-3 md:p-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggle(task)}
                            className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0" onClick={()=>setSelectedTask(task)}>
                            {task.superCategory && 
                            <p className={`text-[12px] md:text-[11px] text-gray-500 ${task.superCategory.completed ? 'line-through opacity-50' : ''}`}>
                              {task.superCategory.text}
                            </p>
                            }
                            <p className={`text-sm md:text-[13px] text-gray-900 ${task.completed ? 'line-through opacity-50' : ''}`}>
                              {task.text}
                            </p>
                            <p className="md:text-[11px] text-xs text-gray-500 mt-1 md:text-">
                              {task.hours}h {task.minutes}m
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {quadrant === 'Q1' && !task.completed && (
                              <button 
                              type='button'
                                onClick={() => handleStartTimer(task)}
                                className="w-8 h-8 md:w-4 md:h-4 flex items-center justify-center text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {task.completed && (
                              <button 
                                type='button'
                                onClick={() => onStoreTask(task.id)}
                                className='w-8 h-8 md:w-4 md:h-4 flex items-center justify-center text-gray-400 hover:text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors'
                              >
                                <Archive className='w-4 h-4' />
                              </button>
                            )
                            }
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="w-8 h-8 md:w-4 md:h-4 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-zinc-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-[calc(5rem+1.5rem)] left-0 right-0 mx-auto w-full max-w-md px-6 pointer-events-none z-50">
        <div className="flex justify-end pointer-events-auto">
          <FloatingButton 
            onClick={() => {
              const newTask: Task = {
                id: crypto.randomUUID(),
                text: "",
                importance: 2,
                hours: 0,
                minutes: 30,
                deadline: 'Today',
                completed: false,
                createdAt: Date.now()
              };
              setSelectedTask(newTask);
            }}
          />
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />

      {selectedTask && (
        <PrioritizeModal 
          viewPage='Today'
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          isOpen={!!selectedTask}
          onClose={()=>setSelectedTask(null)}
          task={selectedTask}
          onSaveTask={onPrioritizeTask}
          onSaveCategory={onPrioritizeCategory}
        />
      )}

      {timerTask && (
        <FocusTimer
          isOpen={!!timerTask}
          onClose={() => setTimerTask(null)}
          task={timerTask}
          onComplete={handleTimerComplete}
        />
      )}

    </div>
  );
}
