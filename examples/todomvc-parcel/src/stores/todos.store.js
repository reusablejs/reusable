import { useEffect, useState } from "react";
import { createStore } from "reusable";
import { set, update, omit, mapValues, keyBy, omitBy, take } from 'lodash/fp';
import uuid from 'uuid';

export const useTodos = createStore(() => {
  const [todos, setTodos] = useState({});

  // fetch todos on start:
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        const keyedTodos = keyBy(
          'id',
          take(5, data)
        );
        setTodos(keyedTodos);
      });
  }, []);

  // return object with actions:
  return {
    todos,
    addTodo: (title) => {
      const action = {
        id: uuid.v4(),
        title,
        completed: false
      };
      setTodos(set(action.id, action));
    },
    removeTodo: (id) => setTodos(omit(id)),
    toggleTodo: (id) => setTodos(update([id, 'completed'], prev => !prev)),
    completeAll: () => setTodos(mapValues(set('completed', true))),
    setAllIncomplete: () => setTodos(mapValues(set('completed', false))),
    clearCompleted: () => setTodos(omitBy(todo => todo.completed))
  };
  // We only need to notify changes if todos changed.
  // Alternatively, we could wrap each action with useCallback and skip the second param to Memo
});
