import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStore } from "reusable";

import {
  addTodo,
  toggleTodo,
  visibilityFilters,
  clearCompleted,
  removeTodo
} from "./todosConstants";
import { getActiveTodosCount, getAllTodos } from "./todosSelectors";

export const useFilterStore = createStore(() => {
  const [filter, setFilter] = useState(visibilityFilters.ALL);
  return {
    filter,
    onFilterChange: setFilter
  };
});

export const useFilterTodosStore = createStore(() => {
  const { todos } = useTodos();
  //Using reusable store inside reusable store with redux hooks
  const { filter } = useFilterStore();
  return {
    filteredTodos: useMemo(
      () =>
        todos.filter(todo => {
          if (filter === "ACTIVE") {
            return !todo.completed;
          } else if (filter === "COMPLETED") {
            return todo.completed;
          } else {
            return true;
          }
        }),
      [filter, todos]
    )
  };
});

export const useTodo = () => {
  const dispatch = useDispatch();
  const addTodoItem = useCallback(
    todo => {
      dispatch(addTodo(todo));
    },
    [dispatch]
  );
  const toggleTodoItem = useCallback(
    id => {
      dispatch(toggleTodo(id));
    },
    [dispatch]
  );
  const removeTodoItem = useCallback(
    id => {
      dispatch(removeTodo(id));
    },
    [dispatch]
  );
  return {
    toggleTodo: toggleTodoItem,
    addTodo: addTodoItem,
    removeTodo: removeTodoItem
  };
};

export const useTodos = () => {
  const dispatch = useDispatch();
  const clearCompletedAction = useCallback(
    id => {
      dispatch(clearCompleted(id));
    },
    [dispatch]
  );
  const allTodos = useSelector(getAllTodos, shallowEqual);
  const activeTodosCount = useSelector(getActiveTodosCount, shallowEqual);
  return {
    todos: allTodos,
    activeTodosCount,
    clearCompleted: clearCompletedAction
  };
};
