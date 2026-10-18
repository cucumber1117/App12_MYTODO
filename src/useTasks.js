import { useState } from 'react';

export default function useTasks() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });
    const saveTasks = (next) => {
        localStorage.setItem('todos', JSON.stringify(next));
        setTasks(next);
    };
    return [tasks, saveTasks];
}
