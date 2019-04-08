import React from "react";
import { todosUnit } from './units/todos.unit';
import { useReuse } from "../../../dist/reusable";
import { Todo } from './Todo';
import { isAllSelectedUnit, filteredTodosUnit } from "./units/todosSelectors.units";

export function Todos() {
  const filteredTodos = useReuse(filteredTodosUnit);
  const { completeAll, setAllIncomplete } = useReuse(todosUnit);
  const isAllSelected = useReuse(isAllSelectedUnit);

  return (
    <section className="main" style={{ display: 'block' }}>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={isAllSelected ? setAllIncomplete : completeAll}
        checked={isAllSelected} />
      <label htmlFor="toggle-all" >Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => <Todo key={todo.id} todo={todo} />)}
      </ul>
    </section>
  )
}
