import { createSelector } from "reselect";

export const getAllTodos = state => state.todos;
export const getActiveTodos = createSelector(
  getAllTodos,
  todos => todos.filter(t => !t.completed)
);
export const getActiveTodosCount = createSelector(
  getActiveTodos,
  todos => todos.length
);
