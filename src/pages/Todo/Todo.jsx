import { useState } from 'react';
import styles from './Todo.module.css';

const getToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };  

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

function Todo() {

    const [inputText,setInputText] = useState('');
    const [inputDate,setInputDate] = useState(getToday());
    const [inputTime,setInputTime] = useState(getCurrentTime());
    const [todos,setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    const handleAddTodo = () => {
        if (inputText.trim() === '') {
            return;
        }
        const newTodo = {
        id: Date.now(),
        text: inputText,
        date: inputDate,
        time: inputTime,
        };

        const newTodos=([...todos,newTodo]);
        setTodos(newTodos);
        localStorage.setItem('todos',JSON.stringify(newTodos));
        setInputText('');
        setInputDate(getToday());
        setInputTime(getCurrentTime());

    };

    const handleDeleteTodo = (id) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    return (
        <div className={styles.page}>
            <div className={styles.home}>
                <h1 className={styles.title}>TODOリスト</h1>

                <div className={styles.inputArea}>
                    <input
                    className={styles.input}
                    type="text"
                    placeholder="やること入力"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    />
                    <input
                    className={styles.input}
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    />
                    <input
                    className={styles.input}
                    type="time"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleAddTodo} >追加</button>
                </div>

                <ul className={styles.todoList}>
                    {todos.map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <div className={styles.todoContent}>
                            <span className={styles.todoText}>{todo.text}</span>
                            <span className={styles.todoDate}>{todo.date}{todo.time}</span>
                            <button className={styles.deleteButton} onClick={() => handleDeleteTodo(todo.id)} >削除</button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Todo