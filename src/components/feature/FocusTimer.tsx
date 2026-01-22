import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, Clock } from 'lucide-react';
import type { Task } from '../../types/task';
import Modal from '../base/Modal';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onComplete: (actualHours: number, actualMinutes: number) => void;
}

export default function FocusTimer({ isOpen, onClose, task, onComplete }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [actualHours, setActualHours] = useState(0);
  const [actualMinutes, setActualMinutes] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRunning(false);
    const totalMinutes = Math.floor(seconds / 60);
    setActualHours(Math.floor(totalMinutes / 60));
    setActualMinutes(totalMinutes % 60);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = () => {
    onComplete(actualHours, actualMinutes);
    setShowFeedback(false);
    setSeconds(0);
    onClose();
  };

  const estimatedMinutes = task.hours * 60 + task.minutes;

  if (showFeedback) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Task Completed!" showCloseButton={false}>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Time:</span>
              <span className="font-semibold text-gray-900">
                {task.hours}h {task.minutes}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Actual Time:</span>
              <span className="font-semibold text-gray-900">
                {Math.floor(seconds / 3600)}h {Math.floor((seconds % 3600) / 60)}m
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Adjust Actual Time (Optional)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={actualHours.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const cleanValue = isNaN(val) ? 0 : val;
                    setActualHours(Math.min(12, Math.max(0, cleanValue)));
                  
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
                  value={actualMinutes.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const cleanValue = isNaN(val) ? 0 : val;
                    setActualMinutes(Math.min(59, Math.max(0, cleanValue)));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitFeedback}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors whitespace-nowrap"
          >
            Submit
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="h-full flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-md w-full"
          >
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>

            <div>
              <h2 className="text-white text-xl font-medium mb-2">Focus Time</h2>
              <p className="text-white/70 text-sm line-clamp-2">{task.text}</p>
            </div>

            <div className="text-7xl font-bold text-white tabular-nums">
              {formatTime(seconds)}
            </div>

            <div className="text-white/50 text-sm">
              Estimated: {task.hours}h {task.minutes}m
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-16 h-16 flex items-center justify-center bg-white text-slate-900 rounded-full hover:bg-white/90 transition-colors shadow-lg"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              
              {seconds > 0 && (
                <button
                  onClick={handleStop}
                  className="px-6 h-16 flex items-center justify-center bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors shadow-lg font-medium whitespace-nowrap"
                >
                  Complete Task
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
