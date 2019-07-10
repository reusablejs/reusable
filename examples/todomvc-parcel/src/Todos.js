import React from "react";
import { useTodos } from './stores/todos.store';
import { Todo } from './Todo';
import { useIsAllSelected, useFilteredTodos } from "./stores/todosSelectors.stores";

export function Todos() {
  const filteredTodos = useFilteredTodos();
  const { completeAll, setAllIncomplete } = useTodos();
  const isAllSelected = useIsAllSelected();

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
