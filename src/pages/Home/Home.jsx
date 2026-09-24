import { useState } from 'react';
import styles from './Home.module.css'
import BottomSheet from '../../component/BottomSheet/BottomSheet.jsx';
import { getEnabledPeriods, getDisplayPeriod, getPeriodFromTime } from './periods.js';

function Home({ periodSettings }) {
    const enabledPeriods = getEnabledPeriods(periodSettings);

    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    const getToday= () => {
        const today = new Date();
        const year = today.getFullYear();
        const month =String(today.getMonth()+1).padStart(2,'0');
        const day =String(today.getDate()).padStart(2,'0');
        return `${year}-${month}-${day}`;
    };

    const selectedDate = getToday();
    const today = new Date();
    const dateLabel = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric' }).format(today);
    const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'long' }).format(today);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [inputText, setInputText] = useState('');
    const [inputDate, setInputDate] = useState(getToday);
    const [inputPeriod, setInputPeriod] = useState(enabledPeriods[0]);
    const [isTimeEnabled, setIsTimeEnabled] = useState(false);
    const [inputTime, setInputTime] = useState('');
    const [message, setMessage] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();
        if (!inputText.trim() || !inputDate || (isTimeEnabled && !inputTime)) return;

        const newTodos = [...todos, {
            id: crypto.randomUUID(),
            text: inputText.trim(),
            date: inputDate,
            period: isTimeEnabled ? getPeriodFromTime(inputTime) : inputPeriod,
            time: isTimeEnabled ? inputTime : '',
        }];
        localStorage.setItem('todos', JSON.stringify(newTodos));
        setTodos(newTodos);
        setMessage(`${inputDate}の予定を追加しました。`);
        setInputText('');
        setInputDate(getToday());
        setInputPeriod(enabledPeriods[0]);
        setIsTimeEnabled(false);
        setInputTime('');
        setIsAdding(false);
    };

    const selectedTodos = todos.filter((todo) => todo.date === selectedDate);
    const visiblePeriods = selectedTodos.some((todo) => getDisplayPeriod(todo, periodSettings) === '未分類')
        ? [...enabledPeriods, '未分類'] : enabledPeriods;

    return (
        <div className={styles.page}>
            <div className={styles.home}>
                <header className={styles.pageHeader}>
                    <p className={styles.eyebrow}>MY TODO <span>DAILY PLANNER</span></p>
                    <div className={styles.headingRow}>
                        <div><p className={styles.dateLabel}>{dateLabel}・{weekday}</p><h1 className={styles.title}>今日の予定<span>。</span></h1></div>
                        <div className={styles.calendarBadge} aria-hidden="true"><span>{today.getMonth() + 1}月</span><strong>{today.getDate()}</strong></div>
                    </div>
                    <div className={styles.summary}><span>今日</span><p>{selectedTodos.length}件の予定</p></div>
                </header>
                <button
                    className={styles.addButton}
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setIsAdding(true)}
                >
                    <span aria-hidden="true">＋</span> 予定追加
                </button>
                {isAdding && (
                    <BottomSheet title="予定追加" titleId="add-todo-title" onClose={() => setIsAdding(false)}>
                    <form id="add-todo-form" className={styles.inputArea} onSubmit={handleAddTodo}>
                        <label htmlFor="todo-text">予定</label>
                        <input id="todo-text" className={styles.input} type="text"
                            placeholder="どんな予定ですか？" required
                            value={inputText} onChange={(event) => setInputText(event.target.value)} />
                        <label htmlFor="todo-date">日付</label>
                        <input id="todo-date" className={styles.input} type="date" required
                            value={inputDate} onChange={(event) => setInputDate(event.target.value)} />
                        {!isTimeEnabled && <>
                        <label htmlFor="todo-period">時間帯</label>
                        <select id="todo-period" className={styles.input}
                            value={inputPeriod} onChange={(event) => setInputPeriod(event.target.value)}>
                            {enabledPeriods.map((period) => (
                                <option key={period} value={period}>{period}</option>
                            ))}
                        </select>
                        </>}
                        <button className={styles.secondaryButton} type="button"
                            aria-expanded={isTimeEnabled} aria-controls="todo-time-details"
                            onClick={() => setIsTimeEnabled(!isTimeEnabled)}>
                            {isTimeEnabled ? '時間帯の選択に戻る' : '時間を選択'}
                        </button>
                        {isTimeEnabled && (
                            <div id="todo-time-details" className={styles.inputArea}>
                                <label htmlFor="todo-time">時刻</label>
                                <input id="todo-time" className={styles.input} type="time" required
                                    value={inputTime} onChange={(event) => setInputTime(event.target.value)} />
                            </div>
                        )}
                        <button className={styles.button} type="submit" disabled={!inputText.trim()}>予定を追加</button>
                    </form>
                    </BottomSheet>
                )}
                <p className={styles.status} role="status">{message}</p>
                {visiblePeriods.map((period) => (
                    <section className={styles.periodSection} key={period}>
                        <div className={styles.sectionHeading}><h2><span className={styles.periodMark} aria-hidden="true" />{period}</h2><span>{selectedTodos.filter((todo) => getDisplayPeriod(todo, periodSettings) === period).length}件</span></div>
                        <ul className={styles.todoList}>
                    {selectedTodos.filter((todo) => getDisplayPeriod(todo, periodSettings) === period)
                        .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                        .map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <button type="button" className={styles.todoContent}
                            aria-haspopup="dialog" onClick={() => setSelectedTodo(todo)}>
                            <span className={styles.todoDate}>{todo.time ? <time dateTime={`${todo.date}T${todo.time}`}>{todo.time}</time> : period}</span>
                            <span className={styles.todoText}>{todo.text}</span>
                            <span className={styles.chevron} aria-hidden="true">›</span>
                        </button>
                    </li>
                    ))}
                        </ul>
                        {!selectedTodos.some((todo) => getDisplayPeriod(todo, periodSettings) === period) && (
                            <div className={styles.emptyPeriod}><span aria-hidden="true">—</span><p>予定はありません<small>余白のある時間も、大切に。</small></p></div>
                        )}
                    </section>
                ))}
                {selectedTodo && (
                    <BottomSheet title="予定の詳細" titleId="todo-detail-title" onClose={() => setSelectedTodo(null)}>
                        <p className={styles.detailTitle}>{selectedTodo.text}</p>
                        <dl className={styles.details}>
                            <dt>日付</dt><dd>{selectedTodo.date}</dd>
                            <dt>時間帯</dt><dd>{getDisplayPeriod(selectedTodo, periodSettings)}</dd>
                            <dt>時刻</dt><dd>{selectedTodo.time || '指定なし'}</dd>
                        </dl>
                    </BottomSheet>
                )}
            </div>
        </div>
    )
}
export default Home
