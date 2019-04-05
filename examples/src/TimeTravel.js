import React from "react";
import { useTimeTravel } from "../../dist/reuse";

export const TimeTravel = () => {
  const { undo, redo, canUndo, canRedo, currentHistoryIndex } = useTimeTravel();
  return (
    <div>
      <button disabled={!canUndo()} onClick={undo}>
        {currentHistoryIndex}
        Undo
      </button>
      <button disabled={!canRedo()} onClick={redo}>
        Redo
      </button>
    </div>
  );
};
