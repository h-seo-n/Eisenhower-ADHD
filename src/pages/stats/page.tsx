import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Target, Award, Archive, CalendarDays, ChevronRight } from 'lucide-react';
import { getQuadrantInfo } from '@/utils/taskCalculator';
import type { Task } from '../../types/task';
import styles from './page.module.css';

interface StatsProps {
  tasks: Task[];
  archives: Task[];
}

export default function Stats({ tasks, archives }: StatsProps) {
  const { t } = useTranslation();
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
      label: t('stats.tasksCompleted'),
      value: stats.totalCompleted,
      from: '#14b8a6',
      to: '#0d9488',
    },
    {
      icon: Award,
      label: t('stats.criticalTasks'),
      value: stats.q1Completed,
      from: '#ef4444',
      to: '#dc2626',
    },
    {
      icon: Clock,
      label: t('stats.estimatedTime'),
      value: `${stats.totalEstimatedHours}h ${stats.totalEstimatedMinutes}m`,
      from: '#3b82f6',
      to: '#2563eb',
    },
    {
      icon: TrendingUp,
      label: t('stats.timeAccuracy'),
      value: `${stats.avgAccuracy}% ${stats.avgAccuracy > 100 ? t('stats.over') : stats.avgAccuracy > 0 && stats.avgAccuracy < 100 ? t('stats.under') : ""}`,
      from: '#a855f7',
      to: '#9333ea',
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('stats.title')}</h1>
        <p className={styles.subtitle}>{t('stats.subtitle')}</p>
      </div>

      <div className={styles.body}>
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.statCard}
          >
            <div
              className={styles.statBanner}
              style={{ ['--from' as string]: card.from, ['--to' as string]: card.to } as React.CSSProperties}
            >
              <div className={styles.statRow}>
                <div className={styles.statIconWrap}>
                  <card.icon className={styles.statIcon} />
                </div>
                <div className={styles.statTextWrap}>
                  <p className={styles.statLabel}>{card.label}</p>
                  <p className={styles.statValue}>{card.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Archives Accordion */}
        <div className={styles.archiveSection}>
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className={styles.archiveToggle}
          >
            <div className={styles.archiveToggleLeft}>
              <div className={styles.archiveIconWrap}>
                <Archive className={styles.archiveIcon} />
              </div>
              <span className={styles.archiveLabel}>{t('stats.archivedTasks')}</span>
              <span className={styles.archiveCount}>
                {archives?.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isArchiveOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className={styles.chevron} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isArchiveOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={styles.archiveBody}
              >
                <div className={styles.archiveList}>
                  {archives?.length === 0 ? (
                    <div className={styles.archiveEmpty}>
                      {t('stats.noArchived')}
                    </div>
                  ) : (
                    archives?.map((task) => {
                      const qInfo = task.quadrant ? getQuadrantInfo(task.quadrant) : null;

                      return (
                        <div
                          key={task.id}
                          className={styles.archivedItem}
                        >
                          <div className={styles.archivedLeft}>
                            <div className={styles.checkRing}>
                              <div className={styles.checkDot} />
                            </div>

                            <div className={styles.archivedTextWrap}>
                              {task.superCategory &&
                                <p className={`${styles.archivedCategory} ${task.superCategory.completed ? styles.archivedCategoryStruck : ''}`}>
                                  {task.superCategory.text}
                                </p>}
                              <p className={styles.archivedText}>
                                {task.text}
                              </p>
                              <div className={styles.archivedMeta}>
                                {qInfo && (
                                  <span
                                    className={styles.archivedQuadrant}
                                    style={{ backgroundColor: qInfo.bg, color: qInfo.text }}
                                  >
                                    {task.quadrant}
                                  </span>
                                )}
                                {task.completedAt && (
                                  <span className={styles.archivedDate}>
                                    <CalendarDays className={styles.archivedDateIcon} />
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
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t('stats.noStats')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
