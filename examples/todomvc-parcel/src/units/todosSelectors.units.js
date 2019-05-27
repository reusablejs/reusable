import { reusable } from "reusable";
import { useMemo } from "react";
import { values, every } from 'lodash/fp';
import { useTodos } from "./todos.unit";
import { useFilter } from "./filter.units";

export const useTodosArray = reusable(() => {
  const { todos } = useTodos();

  return useMemo(() => values(todos), [todos]);
});

export const useFilteredTodos = reusable(() => {
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

export const useIsAllSelected = reusable(() => {
  const todosArray = useTodosArray();

  return every(todo => todo.completed, todosArray);
});

export const useTodosLeft = reusable(() => {
  const todosArray = useTodosArray();

  return todosArray.filter(todo => !todo.completed).length;
});
