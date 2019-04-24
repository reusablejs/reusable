import React from "react";
import { useReuse } from "reusable";
import { filterUnit, FILTERS } from "./units/filter.units";
import { todosUnit } from "./units/todos.unit";
import { todosLeftUnit } from "./units/todosSelectors.units";

export function Footer() {
  const [filter, setFilter] = useReuse(filterUnit);
  const { clearCompleted } = useReuse(todosUnit)
  const todosLeft = useReuse(todosLeftUnit);

  return (
    <footer className="footer">
      <span className="todo-count">{todosLeft} items left</span>
      <ul className="filters">
        {
          Object.keys(FILTERS).map(filterKey => (
            <li key={filterKey}>
              <a
                onClick={() => setFilter(filterKey)}
                className={filter === filterKey ? 'selected' : ''}>{FILTERS[filterKey]}</a>
            </li>
          ))
        }
      </ul>
      <button className="clear-completed" onClick={clearCompleted}>Clear completed</button>
    </footer>
  );
}
