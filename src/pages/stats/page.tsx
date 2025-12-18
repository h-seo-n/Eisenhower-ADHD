import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import type { Task } from '../../types/task';

interface StatsProps {
  tasks: Task[];
}

export default function Stats({ tasks }: StatsProps) {
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
      value: `${stats.avgAccuracy}%`,
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

        {stats.totalCompleted === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Complete some tasks to see your stats!</p>
          </div>
        )}
      </div>
    </div>
  );
}
