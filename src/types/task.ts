export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type DeadlineType = 'Today' | 'Tomorrow' | 'Specific Date' | 'No Deadline';

export interface Task {
  id: string;
  text: string;
  importance: number;
  hours: number;
  minutes: number;
  deadline: DeadlineType;
  specificDate?: string;
  quadrant?: Quadrant;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  actualHours?: number;
  actualMinutes?: number;
}

export interface TimeEntry {
  taskId: string;
  taskText: string;
  estimatedMinutes: number;
  actualMinutes: number;
  completedAt: number;
}
