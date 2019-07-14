import React from "react";
import { visibilityFilters } from "../todosConstants";

import { useTodos, useFilterStore } from "../todosHooks";

export function Footer() {
  const { filter, onFilterChange } = useFilterStore();
  const { activeTodosCount, clearCompleted } = useTodos();

  return (
    <footer className="footer">
      <span className="todo-count">{activeTodosCount} items left</span>
      <ul className="filters">
        {Object.keys(visibilityFilters).map(filterKey => (
          <li key={filterKey}>
            <a
              onClick={() => onFilterChange(filterKey)}
              className={filter.toUpperCase() === filterKey ? "selected" : ""}
            >
              {visibilityFilters[filterKey]}
            </a>
          </li>
        ))}
      </ul>
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}
