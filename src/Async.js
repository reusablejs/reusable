import React, { useEffect } from "react";
import { useTodos } from "./todos.state";

export const Async = () => {
  const todos = useTodos();

  useEffect(() => {
    todos.fetch();

    return todos.clear;
  }, []);

  return todos.value === null ? (
    "loading..."
  ) : (
    <ul>
      {todos.value.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          {todo.title}
        </li>
      ))}
    </ul>
  );
};
