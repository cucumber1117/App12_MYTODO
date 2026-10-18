import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTasks from '../../useTasks.js';
import { tasksOnDate, toggleTask, repeatLabel, WEEKDAYS } from '../../tasks.js';
import styles from './Home.module.css'
import BottomSheet from '../../component/BottomSheet/BottomSheet.jsx';
import { getEnabledPeriods, getDisplayPeriod, getPeriodFromTime } from './periods.js';
import DatePicker from './DatePicker.jsx';
import { formatDate, parseDate } from './dates.js';

function Home({ periodSettings, isDateList = false }) {
    const enabledPeriods = getEnabledPeriods(periodSettings);

    const [todos, setTodos] = useTasks();
    const [searchParams, setSearchParams] = useSearchParams();
    const [repeat, setRepeat] = useState(searchParams.has('recurring') ? 'daily' : 'none');
    const [weekdays, setWeekdays] = useState([]);

    const [browsedDate, setBrowsedDate] = useState(() => formatDate(new Date()));
    const selectedDate = isDateList ? browsedDate : formatDate(new Date());
    const date = parseDate(selectedDate);
    const dateLabel = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'long' }).format(date);
    const [isAdding, setIsAdding] = useState(searchParams.has('recurring'));
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [inputText, setInputText] = useState('');
    const [inputDate, setInputDate] = useState(selectedDate);
    const [inputPeriod, setInputPeriod] = useState(enabledPeriods[0]);
    const [isTimeEnabled, setIsTimeEnabled] = useState(false);
    const [inputTime, setInputTime] = useState('');
    const [message, setMessage] = useState('');
    const closeAdd = () => {
        setIsAdding(false);
        if (searchParams.has('recurring')) setSearchParams({}, { replace: true });
    };

    const handleAddTodo = (event) => {
        event.preventDefault();
        if (!inputText.trim() || !inputDate || (isTimeEnabled && !inputTime) || (repeat === 'weekly' && !weekdays.length)) return;

        const newTodos = [...todos, {
            id: crypto.randomUUID(),
            text: inputText.trim(),
            date: inputDate,
            period: isTimeEnabled ? getPeriodFromTime(inputTime) : inputPeriod,
            time: isTimeEnabled ? inputTime : '',
            repeat,
            weekdays: repeat === 'weekly' ? weekdays : [],
            completed: false,
            completedDates: {},
        }];
        setTodos(newTodos);
        setMessage(repeat === 'none' ? `${inputDate}の予定を追加しました。` : `${inputDate}からの定期タスクを登録しました。`);
        setInputText('');
        if (isDateList) setBrowsedDate(inputDate);
        setInputDate(selectedDate);
        setInputPeriod(enabledPeriods[0]);
        setIsTimeEnabled(false);
        setInputTime('');
        setRepeat('none');
        setWeekdays([]);
        closeAdd();
    };

    const selectedTodos = tasksOnDate(todos, selectedDate);
    const detailTodo = selectedTodo && selectedTodos.find((todo) => todo.id === selectedTodo.id);
    const visiblePeriods = selectedTodos.some((todo) => getDisplayPeriod(todo, periodSettings) === '未分類')
        ? [...enabledPeriods, '未分類'] : enabledPeriods;

    return (
        <div className={styles.page}>
            <div className={styles.home}>
                <header className={styles.pageHeader}>
                    <p className={styles.eyebrow}>MY TODO <span>DAILY PLANNER</span></p>
                    <div className={styles.headingRow}>
                        <div><p className={styles.dateLabel}>{dateLabel}・{weekday}</p><h1 className={styles.title}>{isDateList ? '予定一覧' : '今日の予定'}<span>。</span></h1></div>
                        <div className={styles.calendarBadge} aria-hidden="true"><span>{date.getMonth() + 1}月</span><strong>{date.getDate()}</strong></div>
                    </div>
                    {isDateList && <DatePicker selectedDate={selectedDate} todos={todos} onSelect={(value) => { setBrowsedDate(value); setMessage(''); }} />}
                    <div className={styles.summary}><span>{isDateList ? `${date.getMonth() + 1}月${date.getDate()}日（${weekday}）` : '今日'}</span><p>{selectedTodos.filter((todo) => todo.completed).length} / {selectedTodos.length}件 完了</p></div>
                </header>
                <button
                    className={styles.addButton}
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => { setInputDate(selectedDate); setIsAdding(true); }}
                >
                    <span aria-hidden="true">＋</span> 予定追加
                </button>
                {isAdding && (
                    <BottomSheet title="予定追加" titleId="add-todo-title" onClose={closeAdd}>
                    <form id="add-todo-form" className={styles.inputArea} onSubmit={handleAddTodo}>
                        <label htmlFor="todo-text">予定</label>
                        <input id="todo-text" className={styles.input} type="text"
                            placeholder="どんな予定ですか？" required
                            value={inputText} onChange={(event) => setInputText(event.target.value)} />
                        <label htmlFor="todo-date">{repeat === 'none' ? '日付' : '開始日'}</label>
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
                        <label htmlFor="todo-repeat">繰り返し</label>
                        <select id="todo-repeat" className={styles.input} value={repeat} onChange={(event) => setRepeat(event.target.value)}>
                            <option value="none">繰り返しなし</option><option value="daily">毎日</option><option value="weekly">曜日を指定</option>
                        </select>
                        {repeat === 'weekly' && <fieldset className={styles.weekdays}><legend>繰り返す曜日（1つ以上）</legend>
                            {WEEKDAYS.map((label, day) => <label key={day}><input type="checkbox" checked={weekdays.includes(day)}
                                onChange={(event) => setWeekdays(event.target.checked ? [...weekdays, day] : weekdays.filter((value) => value !== day))} />{label}</label>)}
                        </fieldset>}
                        <button className={styles.button} type="submit" disabled={!inputText.trim() || (repeat === 'weekly' && !weekdays.length)}>予定を追加</button>
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
                    <li className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`} key={todo.id} >
                        <label className={styles.checkArea}><input type="checkbox" checked={todo.completed}
                            aria-label={`${todo.text}を完了`} onChange={() => setTodos(toggleTask(todos, todo.id, selectedDate))} /></label>
                        <button type="button" className={styles.todoContent}
                            aria-haspopup="dialog" onClick={() => setSelectedTodo(todo)}>
                            <span className={styles.todoDate}>{todo.time ? <time dateTime={`${todo.date}T${todo.time}`}>{todo.time}</time> : period}</span>
                            <span className={styles.todoText}>{todo.text}{todo.repeat && todo.repeat !== 'none' && <small className={styles.repeatBadge}>{repeatLabel(todo)}</small>}</span>
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
                            <dt>繰り返し</dt><dd>{repeatLabel(selectedTodo)}</dd>
                            <dt>状態</dt><dd>{detailTodo?.completed ? '完了' : '未完了'}</dd>
                        </dl>
                        <button type="button" className={styles.button} onClick={() => setTodos(toggleTask(todos, selectedTodo.id, selectedDate))}>{detailTodo?.completed ? '未完了に戻す' : '完了にする'}</button>
                    </BottomSheet>
                )}
            </div>
        </div>
    )
}
export default Home
