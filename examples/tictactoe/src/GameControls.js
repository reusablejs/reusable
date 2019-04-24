import React from 'react';
import { useReuse } from 'reusable';
import { gameUnit } from './units/board.unit';
import Cell from './Cell';

const GameControls = () => {
  const { winner, ended, tie, resetGame, currentPlayer } = useReuse(gameUnit);

  return (
    <div>
      {!ended &&
        <h1>
          <Cell value={currentPlayer} />'s turn
        </h1>
      }
      {
        tie && <h1>It's a draw!</h1>
      }
      {
        winner && <h1><Cell value={winner} /> is the winner!</h1>
      }
      <button onClick={resetGame}>New Game</button>
    </div>
  );
}

export default GameControls;