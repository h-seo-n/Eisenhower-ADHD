import type { Task, CategoryTask } from "@/types/task";

export function isTask(item: Task | CategoryTask | null): item is Task {
    console.log(`${item?.text} is task? ${item!==null && 'hours' in item}`)
    return item !== null && 'hours' in item;
}