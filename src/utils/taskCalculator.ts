import type { Task, Quadrant, DeadlineType } from '../types/task';

export function calculateQuadrant(
  importance: number,
  deadline: DeadlineType,
  specificDate?: string
): Quadrant {
  const isUrgent = calculateUrgency(deadline, specificDate);
  const isImportant = importance >= 3;

  if (isUrgent && isImportant) return 'Q1';
  if (!isUrgent && isImportant) return 'Q2';
  if (isUrgent && !isImportant) return 'Q3';
  return 'Q4';
}

function calculateUrgency(deadline: DeadlineType, specificDate?: string): boolean {
  if (deadline === 'Today') return true;
  if (deadline === 'Tomorrow') return true;
  
  if (deadline === 'Specific Date' && specificDate) {
    const targetDate = new Date(specificDate);
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
      color: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-500'
    },
    Q2: {
      title: 'Plan',
      subtitle: 'Important, Not Urgent',
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-500'
    },
    Q3: {
      title: 'Delegate',
      subtitle: 'Urgent, Not Important',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-500'
    },
    Q4: {
      title: 'Eliminate',
      subtitle: 'Neither Urgent nor Important',
      color: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-500'
    }
  };
  
  return info[quadrant];
}
