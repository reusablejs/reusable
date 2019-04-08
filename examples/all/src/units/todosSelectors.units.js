import { reuseMemo, Memo, reuse } from "../../reusable";
import { values, every } from 'lodash/fp';
import { todosUnit } from "./todos.unit";
import { filterUnit } from "./filter.units";

export const todosArrayUnit = () => {
  const { todos } = reuse(todosUnit);

  return reuseMemo(() => values(todos), [todos]);
}

export const filteredTodosUnit = Memo(() => {
  const todosArray = reuse(todosArrayUnit);
  const [filter] = reuse(filterUnit);

  return reuseMemo(() => todosArray.filter(todo => {
    if (filter === 'ACTIVE') {
      return !todo.completed;
    } else if (filter === 'COMPLETED') {
      return todo.completed
    } else {
      return true;
    }
  }), [filter, todosArray]);
});

export const isAllSelectedUnit = () => {
  const todosArray = reuse(todosArrayUnit);

  return every(todo => todo.completed, todosArray);
}

export const todosLeftUnit = () => {
  const todosArray = reuse(todosArrayUnit);

  return todosArray.filter(todo => !todo.completed).length;
}