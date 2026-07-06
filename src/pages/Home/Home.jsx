import { useState } from 'react';
import styles from './Home.module.css'

function Home() {

    const [inputText,setInputText] = useState(' ');
    const [inputDate,setInputDate] = useState('');
    const [todos,setTodos] = useState([]);

    const handleAddTodo = () => {
        if (inputText.trim() === '') {
            return;
        }
        const newTodo = {
        id: Date.now(),
        text: inputText,
        date: inputDate,
        };

        setTodos([...todos,newTodo]);
        setInputText('');
        setInputDate('');

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
                    type="text"
                    placeholder="期限"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleAddTodo} >追加</button>
                </div>

                <ul className={styles.todoList}>
                    {todos.map((todo) => (
                    <li className={styles.todoItem} key={todo.id} >
                        <div className={styles.todoContent}>
                            <span className={styles.todoText}>{todo.text}</span>
                            <span className={styles.todoDate}>{todo.date}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default Home