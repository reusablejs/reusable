import React, { useEffect } from "react";
import { useReuse } from "reuse-react";
import { reuseTodos } from "./todos.state";

export const Async = () => {
  const todos = useReuse(reuseTodos);

  useEffect(() => {
    todos.fetch();

    return todos.clear;
  }, []);

  return todos.value === null ? (
    "loading..."
  ) : (
    <ul>
      <button onClick={todos.fetch}>Fetch</button>
      {todos.value.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          {todo.title}
        </li>
      ))}
    </ul>
  );
};
