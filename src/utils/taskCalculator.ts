import type { Quadrant, DeadlineType, Task } from '../types/task';

export function calculateQuadrant(
  importance: number,
  deadline: DeadlineType,
  specificDate?: Date | string
): Quadrant {
  const isUrgent = calculateUrgency(deadline, specificDate);
  const isImportant = importance >= 3;

  if (isUrgent && isImportant) return 'Q1';
  if (!isUrgent && isImportant) return 'Q2';
  if (isUrgent && !isImportant) return 'Q3';
  return 'Q4';
}

export function calculateTaskQuadrant(task: Task): Quadrant {
  if (task.superCategory) {
    return calculateQuadrant(
      task.superCategory.importance,
      task.superCategory.deadline,
      task.superCategory.specificDate
    );
  }

  return calculateQuadrant(task.importance, task.deadline, task.specificDate);
}

function calculateUrgency(deadline: DeadlineType, specificDate?: Date | string): boolean {
  if (deadline === 'Today') return true;
  if (deadline === 'Tomorrow') return true;

  if (deadline === 'Specific Date' && specificDate) {
    const targetDate = new Date(specificDate instanceof Date ? specificDate.getTime() : specificDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 2;
  }
  
  return false;
}

export function getQuadrantInfo(quadrant: Quadrant) {
  const info = {
    Q1: {
      title: 'Do Now',
      subtitle: 'Urgent & Important',
      bg: '#FDE3E9',
      text: '#B33453',
    },
    Q2: {
      title: 'Plan',
      subtitle: 'Important, Not Urgent',
      bg: '#FFF6E0',
      text: '#B49243',
    },
    Q3: {
      title: 'Delegate',
      subtitle: 'Urgent, Not Important',
      bg: '#CFE8F0',
      text: '#118AB2',
    },
    Q4: {
      title: 'Eliminate',
      subtitle: 'Neither Urgent nor Important',
      bg: '#CDD8DB',
      text: '#073B4C',
    },
  };

  return info[quadrant];
}
