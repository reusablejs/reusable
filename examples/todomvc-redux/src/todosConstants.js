let nextTodoId = 0;
export const visibilityFilters = {
  ALL: "All",
  ACTIVE: "Active",
  COMPLETED: "Completed"
};

export const addTodo = text => ({
  type: "ADD_TODO",
  id: nextTodoId++,
  text
});

export const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  id
});

export const removeTodo = id => ({
  type: "REMOVE_TODO",
  id
});

export const clearCompleted = () => ({
  type: "CLEAR_COMPLETED"
});
