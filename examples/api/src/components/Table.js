import React from "react";

import { Loader } from "./Loader";

export const Table = props => {
  const dataColumns = props.columns;
  const dataRows = props.data;
  const tableHeaders = (
    <thead>
      <tr>
        {dataColumns.map((column, key) => {
          return <th key={key}>{column.toUpperCase()}</th>;
        })}
      </tr>
    </thead>
  );
  const tableBody = dataRows.map((row, index) => {
    return (
      <tr key={index}>
        {dataColumns.map((column, key) => {
          return (
            <td key={key}>
              {row[column] ? row[column] : <Loader size="sm" />}
            </td>
          );
        })}
      </tr>
    );
  });
  return (
    <table className="table table-bordered table-hover">
      {tableHeaders}
      <tbody>{tableBody}</tbody>
    </table>
  );
};
