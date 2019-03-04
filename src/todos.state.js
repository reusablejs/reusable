import { reuse } from "./reuse";

export const useTodos = reuse(reuseState => {
  const [todos, setTodos] = reuseState([]);

  return {
    value: todos,
    fetch: () => {
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then(body => body.json())
        .then(data => setTodos(data));
    },
    clear: () => setTodos(null)
  };
});
