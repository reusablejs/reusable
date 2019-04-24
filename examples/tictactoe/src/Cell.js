import React from 'react';

const Cell = ({ value, nextValue }) => (
  <span className="cell-content">
    {!value && nextValue && <span className="next-value">{nextValue}</span>}
    {value && <span className="value">{value}</span>}
  </span>
);

export default Cell;
