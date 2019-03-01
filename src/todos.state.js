import { useEffect } from "react";
import { reuseState } from "./reuse";

export const useTodos = () => {
  const [todos, setTodos] = reuseState("todos");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(body => body.json())
      .then(setTodos);

    return () => setTodos(null);
  }, []);

  return todos;
};
