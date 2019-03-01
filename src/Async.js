import React, { useEffect } from "react";
import { useTodos } from "./todos.state";

export const Async = () => {
  const todos = useTodos();

  return todos === null ? (
    "loading..."
  ) : (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          {todo.title}
        </li>
      ))}
    </ul>
  );
};
