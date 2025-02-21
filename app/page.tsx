"use client";
import { useState, useEffect } from "react";

interface Todo {
  id: number;
  content: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos', {method: 'GET'});
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newTodo }),
      });

      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo("");
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-200">
      <div className="max-w-2xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mt-12">
        <h1 className="text-5xl font-black mb-8 uppercase tracking-tighter">
          Todo List
          <span className="inline-block ml-2 animate-bounce">⚡</span>
        </h1>
        
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-4 py-3 border-4 border-black rounded-none 
                focus:outline-none focus:ring-4 ring-blue-400
                placeholder:text-gray-500 text-lg"
              placeholder="What needs to be done?"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white text-lg font-bold 
                border-4 border-black hover:bg-blue-600 hover:border-blue-600 
                transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
                active:translate-y-1 active:shadow-none"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-4 p-4 border-4 border-black
                ${todo.completed ? 'bg-green-200' : 'bg-white'}
                transition-colors`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-6 w-6 border-4 border-black rounded-none
                  checked:bg-green-400 checked:border-green-400
                  focus:ring-4 ring-blue-400"
              />
              <span 
                className={`flex-1 text-lg ${todo.completed ? 
                  'line-through decoration-4 decoration-black text-gray-600' : 
                  'text-black'}`}
              >
                {todo.content}
              </span>
              <span className="text-sm font-mono bg-black text-white px-2 py-1">
                {todo.completed ? 'DONE' : 'TODO'}
              </span>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No todos yet! Add some tasks above 📝
            </p>
          </div>
        )}

        <footer className="mt-12 pt-8 border-t-4 border-black">
          <p className="text-sm font-mono text-gray-600">
            {todos.length} task{todos.length !== 1 ? 's' : ''} total • 
            {todos.filter(t => t.completed).length} completed
          </p>
        </footer>
      </div>
    </div>
  );
}
