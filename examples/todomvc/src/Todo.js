import React from "react";
import { useTodos } from "./units/todos.unit";

export function Todo({ todo }) {
  const { toggleTodo, removeTodo } = useTodos();

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)} />
        <label>{todo.title}</label>
        <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
      </div>
    </li>
  )
}
