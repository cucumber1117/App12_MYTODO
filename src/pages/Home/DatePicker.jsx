import { formatDate, parseDate, shiftDate } from './dates.js';
import styles from './DatePicker.module.css';

export default function DatePicker({ selectedDate, onSelect, todos }) {
    const today = formatDate(new Date());
    // Keep the selected day visible in a Monday–Sunday week.
    const monday = shiftDate(selectedDate, -((parseDate(selectedDate).getDay() + 6) % 7));
    const days = Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));

    return (
        <div className={styles.picker}>
            <div className={styles.controls}>
                <button type="button" onClick={() => onSelect(shiftDate(selectedDate, -7))} aria-label="前の週">‹</button>
                <label className={styles.dateLabel}>
                    <span>日付を選択</span>
                    <input type="date" aria-label="表示する日付" value={selectedDate}
                        onChange={(event) => { if (event.target.value) onSelect(event.target.value); }} />
                </label>
                <button type="button" onClick={() => onSelect(shiftDate(selectedDate, 7))} aria-label="次の週">›</button>
            </div>
            <div className={styles.week} aria-label="日付と曜日">
                {days.map((day) => {
                    const date = parseDate(day);
                    const count = todos.filter((todo) => todo.date === day).length;
                    const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'short' }).format(date);
                    return (
                        <button type="button" key={day} onClick={() => onSelect(day)}
                            className={`${styles.day} ${day === selectedDate ? styles.selected : ''}`}
                            aria-pressed={day === selectedDate}
                            aria-label={`${date.getMonth() + 1}月${date.getDate()}日 ${weekday}曜日、${count}件の予定${day === today ? '、今日' : ''}`}>
                            <span>{weekday}</span><strong>{date.getDate()}</strong>
                            <small>{day === today ? '今日' : count ? `${count}件` : '—'}</small>
                        </button>
                    );
                })}
            </div>
            <button type="button" className={styles.today} onClick={() => onSelect(today)}>今日に戻る</button>
        </div>
    );
}
