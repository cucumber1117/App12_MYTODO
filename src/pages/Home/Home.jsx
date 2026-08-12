import { useState } from 'react';
import styles from './Home.module.css'

function Home() {

    const [todos] = useState(() => {
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

    const [selectedDate,setSelectedDate] = useState(getToday());

    const selectedTodos = todos.filter((todo) => todo.date === selectedDate);

    return (
        <div className={styles.page}>
            <div className={styles.home}>
                <h1 className={styles.title}>今日のタスク</h1>
                <ul className={styles.todoList}>
                    {selectedTodos.map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <div className={styles.todoContent}>
                            <span className={styles.todoText}>{todo.text}</span>
                            <span className={styles.todoDate}>{todo.date}{todo.time}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default Home