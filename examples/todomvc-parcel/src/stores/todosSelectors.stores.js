import { createStore } from "reusable";
import { useMemo } from "react";
import { values, every } from 'lodash/fp';
import { useTodos } from "./todos.store";
import { useFilter } from "./filter.store";

export const useTodosArray = createStore(() => {
  const { todos } = useTodos();

  return useMemo(() => values(todos), [todos]);
});

export const useFilteredTodos = createStore(() => {
  const todosArray = useTodosArray();
  const [filter] = useFilter();

  return useMemo(() => todosArray.filter(todo => {
    if (filter === 'ACTIVE') {
      return !todo.completed;
    } else if (filter === 'COMPLETED') {
      return todo.completed
    } else {
      return true;
    }
  }), [filter, todosArray]);
});

export const useIsAllSelected = createStore(() => {
  const todosArray = useTodosArray();

  return every(todo => todo.completed, todosArray)
});

export const useTodosLeft = createStore(() => {
  const todosArray = useTodosArray();

  return todosArray.filter(todo => !todo.completed).length
});
