import React from "react";

export const Loader = props => {
  return (
    <div className="container">
      <div className={`loader ${props.size}`} />
    </div>
  );
};
