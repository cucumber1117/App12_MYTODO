import { useState } from 'react';
import styles from './Home.module.css'
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
    const [isAdding, setIsAdding] = useState(false);
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
                <h1 className={styles.title}>今日のタスク</h1>
                <button
                    className={styles.button}
                    type="button"
                    aria-expanded={isAdding}
                    aria-controls="add-todo-form"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? '閉じる' : '＋ 予定追加'}
                </button>
                {isAdding && (
                    <form id="add-todo-form" className={styles.inputArea} onSubmit={handleAddTodo}>
                        <label htmlFor="todo-text">予定</label>
                        <input id="todo-text" className={styles.input} type="text"
                            placeholder="やることを入力" required
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
                        <button className={styles.button} type="button"
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
                        <button className={styles.button} type="submit" disabled={!inputText.trim()}>追加</button>
                    </form>
                )}
                <p role="status">{message}</p>
                {visiblePeriods.map((period) => (
                    <section className={styles.periodSection} key={period}>
                        <h2>{period}</h2>
                        <ul className={styles.todoList}>
                    {selectedTodos.filter((todo) => getDisplayPeriod(todo, periodSettings) === period)
                        .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                        .map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <div className={styles.todoContent}>
                            <span className={styles.todoText}>{todo.text}</span>
                            {todo.time && <time className={styles.todoDate} dateTime={`${todo.date}T${todo.time}`}>{todo.time}</time>}
                        </div>
                    </li>
                    ))}
                        </ul>
                        {!selectedTodos.some((todo) => getDisplayPeriod(todo, periodSettings) === period) && (
                            <p className={styles.emptyPeriod}>予定はありません</p>
                        )}
                    </section>
                ))}
            </div>
        </div>
    )
}
export default Home
