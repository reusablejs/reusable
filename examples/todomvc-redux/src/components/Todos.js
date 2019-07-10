import React from "react";

import { Todo } from "./Todo";
import { useFilterTodosStore } from "../todosHooks";

export function Todos() {
  const { filterTodos } = useFilterTodosStore();

  return (
    <section className="main" style={{ display: "block" }}>
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filterTodos.map(todo => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
