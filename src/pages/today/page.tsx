import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Quadrant } from '../../types/task';
import { getQuadrantInfo } from '../../utils/taskCalculator';
import CelebrationModal from '../../components/feature/CelebrationModal';
import FocusTimer from '../../components/feature/FocusTimer';

interface TodayProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCompleteWithTime: (id: string, actualHours: number, actualMinutes: number) => void;
}

export default function Today({ tasks, onToggleComplete, onDeleteTask, onCompleteWithTime }: TodayProps) {
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
    <div className="pb-20">
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
                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggle(task)}
                            className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm text-gray-900 ${task.completed ? 'line-through opacity-50' : ''}`}>
                              {task.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {task.hours}h {task.minutes}m
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {quadrant === 'Q1' && !task.completed && (
                              <button
                                onClick={() => handleStartTimer(task)}
                                className="w-8 h-8 flex items-center justify-center text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />

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
