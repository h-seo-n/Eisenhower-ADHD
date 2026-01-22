import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Target, Award, Archive, CalendarDays, ChevronRight } from 'lucide-react';
import { getQuadrantInfo } from '@/utils/taskCalculator';
import type { Task } from '../../types/task';

interface StatsProps {
  tasks: Task[];
  archives: Task[];
}

export default function Stats({ tasks, archives }: StatsProps) {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed && t.quadrant);
    const totalCompleted = completedTasks.length;
    const q1Completed = completedTasks.filter(t => t.quadrant === 'Q1').length;
    
    let totalEstimatedMinutes = 0;
    let totalActualMinutes = 0;
    let accuracyCount = 0;
    
    completedTasks.forEach(task => {
      const estimated = task.hours * 60 + task.minutes;
      totalEstimatedMinutes += estimated;
      
      if (task.actualHours !== undefined && task.actualMinutes !== undefined) {
        const actual = task.actualHours * 60 + task.actualMinutes;
        totalActualMinutes += actual;
        accuracyCount++;
      }
    });
    
    const avgAccuracy = accuracyCount > 0 
      ? Math.round((totalEstimatedMinutes / totalActualMinutes) * 100)
      : 0;
    
    return {
      totalCompleted,
      q1Completed,
      totalEstimatedHours: Math.floor(totalEstimatedMinutes / 60),
      totalEstimatedMinutes: totalEstimatedMinutes % 60,
      totalActualHours: Math.floor(totalActualMinutes / 60),
      totalActualMinutes: totalActualMinutes % 60,
      avgAccuracy: isFinite(avgAccuracy) ? avgAccuracy : 0
    };
  }, [tasks]);

  const statCards = [
    {
      icon: Target,
      label: 'Tasks Completed',
      value: stats.totalCompleted,
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Award,
      label: 'Critical Tasks (Q1)',
      value: stats.q1Completed,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Clock,
      label: 'Estimated Time',
      value: `${stats.totalEstimatedHours}h ${stats.totalEstimatedMinutes}m`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Time Accuracy',
      value: `${stats.avgAccuracy}% ${stats.avgAccuracy > 100 ? "(over)" : stats.avgAccuracy > 0 && stats.avgAccuracy < 100 ? "(under)" : ""}`,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Statistics</h1>
        <p className="text-indigo-50 text-sm">Track your productivity</p>
      </div>

      <div className="p-4 space-y-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${card.color} p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white/80 text-xs">{card.label}</p>
                  <p className="text-white text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Archives Accordion */}
        <div className="mt-6">
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:bg-gray-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                <Archive className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700">Archived Tasks</span>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                {archives?.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isArchiveOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isArchiveOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white mx-1 mt-1 rounded-b-xl shadow-sm border-x border-b border-gray-100 p-2 space-y-1">
                  {archives?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      No archived tasks yet
                    </div>
                  ) : (
                    archives?.map((task) => {
                      // Optional: Get Quadrant Info if available
                      const qInfo = task.quadrant ? getQuadrantInfo(task.quadrant) : null;
                      
                      return (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {/* Simple completion checkmark visual */}
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            </div>
                            
                            <div className="min-w-0">
                              {task.superCategory && 
                                <p className={`text-[12px] md:text-[11px] text-gray-500 ${task.superCategory.completed ? 'line-through opacity-50' : ''}`}>
                                  {task.superCategory.text}
                                </p>}
                              <p className="text-sm text-gray-600 truncate">
                                {task.text}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {qInfo && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${qInfo.color} ${qInfo.textColor}`}>
                                    {task.quadrant}
                                  </span>
                                )}
                                {task.completedAt && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <CalendarDays className="w-3 h-3" />
                                    {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {stats.totalCompleted === 0 && archives?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Complete some tasks to see your stats!</p>
          </div>
        )}
      </div>
    </div>
  );
}
