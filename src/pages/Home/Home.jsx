import { useState } from 'react';
import styles from './Home.module.css'

function Home() {

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
    const [inputTime, setInputTime] = useState('');
    const [message, setMessage] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();
        if (!inputText.trim() || !inputDate) return;

        const newTodos = [...todos, {
            id: crypto.randomUUID(),
            text: inputText.trim(),
            date: inputDate,
            time: inputTime,
        }];
        localStorage.setItem('todos', JSON.stringify(newTodos));
        setTodos(newTodos);
        setMessage(`${inputDate}の予定を追加しました。`);
        setInputText('');
        setInputDate(getToday());
        setInputTime('');
        setIsAdding(false);
    };

    const selectedTodos = todos.filter((todo) => todo.date === selectedDate);

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
                        <label htmlFor="todo-time">時刻（任意）</label>
                        <input id="todo-time" className={styles.input} type="time"
                            value={inputTime} onChange={(event) => setInputTime(event.target.value)} />
                        <button className={styles.button} type="submit" disabled={!inputText.trim()}>追加</button>
                    </form>
                )}
                <p role="status">{message}</p>
                <ul className={styles.todoList}>
                    {selectedTodos.map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <div className={styles.todoContent}>
                            <span className={styles.todoText}>{todo.text}</span>
                            <span className={styles.todoDate}>{todo.date} {todo.time}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default Home
