import React from "react";

import { useTodo } from "../todosHooks";

export function Todo({ todo }) {
  const { toggleTodo, removeTodo } = useTodo();

  return (
    <li className={todo.completed ? "completed" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <label>{todo.text}</label>
        <button className="destroy" onClick={() => removeTodo(todo.id)} />
      </div>
    </li>
  );
}
