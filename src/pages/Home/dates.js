export function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
}

export function shiftDate(value, days) {
    const date = parseDate(value);
    date.setDate(date.getDate() + days);
    return formatDate(date);
}
