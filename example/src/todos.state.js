import { reuse, reuseState, reuseEffect, reuseMemo } from "../../dist/reuse";

const reusePersist = (key, [value, setValue]) => {
  reuseEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [todos])
  reuseEffect(() => {
    const savedTodos = localStorage.getItem(key);
    if (savedTodos) {
      setValue(JSON.parse(savedTodos));
    }
  }, [])
}

export const useTodos = reuse(() => {
  const [todos, setTodos] = reuseState([]);
  const completedItems = reuseMemo(() => todos.filter(todo => todo.completed), [todos]);

  return {
    todos,
    completedItems,
    fetch: () => {
      setTodos(null);
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then(body => body.json())
        .then(data => setTodos(data));
    },
    clear: () => setTodos(null)
  };
});

const FILTER = {
  ALL: 'All',
  COMPLETED: 'Completed',
  TODO: 'Todo'
};

export const useFilter = reuse(() => {
  const filter = reuseState(FILTER.ALL);

  reusePersist('filter', filter);

  return filter;
});


export const useTodo = reuseMemo((id, todos) => {
  const [item] = todos.filter((todo) => todo.id === id);

  return item;
}, [
  id => id,
  () => useTodos().todos
])

export const useFilteredTodos = reuse(() => {
  const {todos} = useTodos();
  const [filter] = useFilter();

  return reuseMemo(() => todos.filter(({title}) => title.includes(filter)), [todos, filter]);
});
