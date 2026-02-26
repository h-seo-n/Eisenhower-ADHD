import type { Task, CategoryTask } from "@/types/task";

export function isTask(item: Task | CategoryTask | null): item is Task {
    return item !== null && 'hours' in item;
}