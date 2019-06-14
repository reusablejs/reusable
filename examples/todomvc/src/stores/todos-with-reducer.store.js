import { createStore } from "reusable";
import { useEffect, useReducer } from "react";
import { set, update, omit, mapValues, keyBy, omitBy, take } from 'lodash/fp';
import uuid from 'uuid';

const SET_TODOS = '[Todos] set todos';
const ADD_TODO = '[Todos] add todo';
const REMOVE_TODO = '[Todos] remove todo';
const TOGGLE_TODO = '[Todos] toggle todo';
const COMPLETE_ALL = '[Todos] complete all';
const SET_ALL_INCOMPLETE = '[Todos] set all incomplete';
const CLEAR_COMPLETED = '[Todos] clear completed';

const todosReducer = (state, action) => {
  switch (action.type) {
    case SET_TODOS:
      return action.payload

    case ADD_TODO:
      return set(action.payload.id, action.payload, state);

    case REMOVE_TODO:
      return omit(action.payload.id, state)

    case TOGGLE_TODO:
      return update([action.payload.id, 'completed'], prev => !prev, state);

    case COMPLETE_ALL:
      return mapValues(set('completed', true), state)

    case SET_ALL_INCOMPLETE:
      return mapValues(set('completed', false), state)

    case CLEAR_COMPLETED:
      return omitBy(todo => todo.completed, state)

    default: return state;
  }
}

export const useTodos = createStore(() => {
  const [todos, dispatch] = useReducer(todosReducer, {});

  // fetch todos on start:
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(todos => {
        const keyedTodos = keyBy(
          'id',
          take(5, todos)
        );
        dispatch({ type: SET_TODOS, payload: keyedTodos });
      });
  }, []);

  // return object with action creators wrapped in dispatch:
  return {
    todos,
    addTodo: (title) => dispatch({
      type: ADD_TODO,
      payload: {
        id: uuid.v4(),
        title,
        completed: false
      }
    }),
    removeTodo: (id) => dispatch({ type: REMOVE_TODO, payload: { id } }),
    toggleTodo: (id) => dispatch({ type: TOGGLE_TODO, payload: { id } }),
    completeAll: () => dispatch({ type: COMPLETE_ALL }),
    setAllIncomplete: () => dispatch({ type: SET_ALL_INCOMPLETE }),
    clearCompleted: () => dispatch({ type: CLEAR_COMPLETED })
  };
  // We only need to notify changes if todos changed.
  // Alternatively, we could wrap each action with useCallback and skip the second param to Memo
});
