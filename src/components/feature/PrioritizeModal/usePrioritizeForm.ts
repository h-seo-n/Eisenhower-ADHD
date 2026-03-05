import { useEffect, useState } from 'react';
import type { Task, CategoryTask, DeadlineType } from '../../../types/task';
import { calculateTaskQuadrant } from '../../../utils/taskCalculator';
import { toDate } from '../../../utils/dateUtils';
import { isTask } from '@/utils/typeGuards';

interface UsePrioritizeFormOptions {
  task: Task | CategoryTask | null;
  onSaveTask: (task: Task) => void;
  onSaveCategory: (category: CategoryTask, subTasks: Task[], originalTaskId?: string) => void;
  onClose: () => void;
}

export function usePrioritizeForm({ task, onSaveTask, onSaveCategory, onClose }: UsePrioritizeFormOptions) {
  const [content, setContent] = useState(task?.text ?? '');
  const [importance, setImportance] = useState(task?.importance ?? 2);
  const [hours, setHours] = useState(isTask(task) ? task.hours : 0);
  const [minutes, setMinutes] = useState(isTask(task) ? task.minutes : 15);
  const [deadline, setDeadline] = useState<DeadlineType>(task?.deadline ?? 'Today');
  const [specificDate, setSpecificDate] = useState<Date | null>(toDate(task?.specificDate));
  const [isCategoryTask, setIsCategoryTask] = useState(!isTask(task) && task !== null);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subTasksDraft, setSubTasksDraft] = useState<Task[]>(
    task && !isTask(task) ? task.subTasks.map(st => ({ ...st })) : []
  );

  useEffect(() => {
    setContent(task?.text ?? '');
    setImportance(task?.importance ?? 2);
    setHours(isTask(task) ? task.hours : 0);
    setMinutes(isTask(task) ? task.minutes : 15);
    setDeadline(task?.deadline ?? 'Today');
    setSpecificDate(toDate(task?.specificDate));
    console.log(`in useEffect: ${specificDate}`)
    setIsCategoryTask(!isTask(task) && task !== null);
    setSubTasksDraft(task && !isTask(task) ? task.subTasks.map(st => ({ ...st })) : []);
  }, [task]);

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    const newSubtask: Task = {
      id: crypto.randomUUID(),
      text: subtaskInput,
      importance,
      hours: 0,
      minutes: 15,
      deadline: deadline ?? 'Today',
      completed: false,
      createdAt: Date.now(),
    };
    setSubTasksDraft(prev => [...prev, newSubtask]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (taskId: string) => {
    setSubTasksDraft(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSave = () => {
    if (!task) return;
    setSubtaskInput('');

    const resolvedSpecificDate = deadline === 'Specific Date' ? specificDate : undefined;
    console.log(`in handleSave: ${resolvedSpecificDate}`);

    if (isCategoryTask) {
      const existingCategory = !isTask(task) ? task : null;
      const shallowCategory: CategoryTask = {
        id: existingCategory?.id ?? crypto.randomUUID(),
        text: content,
        importance,
        deadline,
        specificDate: resolvedSpecificDate,
        subTasks: [],
        completed: existingCategory?.completed ?? false,
        createdAt: existingCategory?.createdAt ?? Date.now(),
      };

      const subTaskList = subTasksDraft.map(s => ({ ...s, superCategory: shallowCategory }));
      const updatedCategory: CategoryTask = { ...shallowCategory, subTasks: subTaskList };
      const originalTaskId = isTask(task) ? task.id : undefined;
      onSaveCategory(updatedCategory, subTaskList, originalTaskId);
    } else {
      const draftTask = {
        id: task.id ?? crypto.randomUUID(),
        ...(task as Task),
        text: content,
        importance,
        hours,
        minutes,
        deadline,
        specificDate: resolvedSpecificDate,
        createdAt: task.createdAt,
        completed: task.completed,
      } as Task;

      onSaveTask({ ...draftTask, quadrant: calculateTaskQuadrant(draftTask) });
    }

    onClose();
  };

  return {
    content, setContent,
    importance, setImportance,
    hours, setHours,
    minutes, setMinutes,
    deadline, setDeadline,
    specificDate, setSpecificDate,
    isCategoryTask, setIsCategoryTask,
    subtaskInput, setSubtaskInput,
    subTasksDraft,
    handleAddSubtask,
    handleRemoveSubtask,
    handleSave,
  };
}
