export const PERIODS = ['朝', '午前', '午後', '夜'];

export function getEnabledPeriods(settings) {
    return PERIODS.filter((period) =>
        (period !== '朝' || settings.showMorning) && (period !== '夜' || settings.showNight));
}

export function getDisplayPeriod(todo, settings) {
    const period = getTodoPeriod(todo);
    if (period === '朝' && !settings.showMorning) return '午前';
    if (period === '夜' && !settings.showNight) return '午後';
    return period;
}

export function getPeriodFromTime(time) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time ?? '')) return null;
    const hour = Number(time.slice(0, 2));
    if (hour < 9) return '朝';
    if (hour < 12) return '午前';
    if (hour < 18) return '午後';
    return '夜';
}

export function getTodoPeriod(todo) {
    return getPeriodFromTime(todo.time)
        ?? (PERIODS.includes(todo.period) ? todo.period : '未分類');
}
