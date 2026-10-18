import { parseDate } from './pages/Home/dates.js';

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function occursOn(task, date) {
    if (!task.repeat || task.repeat === 'none') return task.date === date;
    if (date < task.date || (task.endDate && date > task.endDate)) return false;
    return task.repeat === 'daily' || (task.repeat === 'weekly' && task.weekdays?.includes(parseDate(date).getDay()));
}

export function tasksOnDate(tasks, date) {
    return tasks.filter((task) => occursOn(task, date)).map((task) => ({
        ...task,
        date,
        completed: task.repeat && task.repeat !== 'none'
            ? Boolean(task.completedDates?.[date]) : Boolean(task.completed),
    }));
}

export function toggleTask(tasks, id, date) {
    return tasks.map((task) => {
        if (task.id !== id) return task;
        if (!task.repeat || task.repeat === 'none') return { ...task, completed: !task.completed };
        const completedDates = { ...task.completedDates };
        if (completedDates[date]) delete completedDates[date];
        else completedDates[date] = true;
        return { ...task, completedDates };
    });
}

export function repeatLabel(task) {
    if (task.repeat === 'daily') return '毎日';
    if (task.repeat === 'weekly') return `毎週 ${WEEKDAYS.filter((_, day) => task.weekdays?.includes(day)).join('・')}`;
    return '繰り返しなし';
}
