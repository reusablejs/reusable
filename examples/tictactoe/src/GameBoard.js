import React from 'react';
import { useReuse } from 'reusable';
import { gameUnit } from './units/board.unit';
import Cell from './Cell';

const GameBoard = () => {
  const { board, play, currentPlayer } = useReuse(gameUnit);

  return (
    <table>
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} onClick={() => play(rowIndex, colIndex)}>
                <Cell value={cell} nextValue={currentPlayer} />
              </td>
            ))}
          </tr>
        ))}
      </tbody></table>
  );
}

export default GameBoard;