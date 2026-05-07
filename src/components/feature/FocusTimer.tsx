import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, Clock } from 'lucide-react';
import type { Task } from '../../types/task';
import Modal from '../base/Modal';
import { useTranslation } from 'react-i18next';
import styles from './FocusTimer.module.css';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onComplete: (actualHours: number, actualMinutes: number) => void;
}

export default function FocusTimer({ isOpen, onClose, task, onComplete }: FocusTimerProps) {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [actualHours, setActualHours] = useState(0);
  const [actualMinutes, setActualMinutes] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        const now = new Date().getTime();
        setSeconds((now - startTime) / 1000);
        console.log(seconds);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date().getTime());
  }

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

  if (showFeedback) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={t('timer.taskCompleted')} showCloseButton={false}>
        <div className={styles.feedback}>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('timer.estimatedTime')}</span>
              <span className={styles.summaryValue}>
                {task.hours}h {task.minutes}m
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('timer.actualTime')}</span>
              <span className={styles.summaryValue}>
                {Math.floor(seconds / 3600)}h {Math.floor((seconds % 3600) / 60)}m
              </span>
            </div>
          </div>

          <div>
            <label className={styles.adjustLabel}>
              {t('timer.adjustActualTime')}
            </label>
            <div className={styles.adjustRow}>
              <div className={styles.adjustField}>
                <label className={styles.adjustHint}>{t('common.hours')}</label>
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
                  className={styles.input}
                />
              </div>
              <div className={styles.adjustField}>
                <label className={styles.adjustHint}>{t('common.minutes')}</label>
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
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitFeedback}
            className={styles.submit}
          >
            {t('timer.submit')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div className={`${styles.timerOverlay} ${isOpen ? '' : styles.timerHidden}`}>
      <div className={styles.timerSurface}>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.timerBody}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.timerInner}
          >
            <div className={styles.timerIconWrap}>
              <Clock className={styles.timerIcon} />
            </div>

            <div>
              <h2 className={styles.timerTitle}>{t('timer.focusTime')}</h2>
              <p className={styles.timerTask}>{task.text}</p>
            </div>

            <div className={styles.timerDigits}>
              {formatTime(seconds)}
            </div>

            <div className={styles.estimateLine}>
              {t('timer.estimated', { hours: task.hours, minutes: task.minutes })}
            </div>

            <div className={styles.controls}>
              <button
                onClick={handleStart}
                className={styles.playButton}
              >
                {isRunning
                  ? <Pause className={styles.playIcon} />
                  : <Play className={`${styles.playIcon} ${styles.playIconOffset}`} />}
              </button>

              {seconds > 0 && (
                <button
                  onClick={handleStop}
                  className={styles.completeButton}
                >
                  {t('timer.completeTask')}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
