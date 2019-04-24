import React from 'react';
import { useReuse } from 'reusable';
import { gameUnit } from './units/board.unit';

const GameScore = () => {
  const { score } = useReuse(gameUnit);

  return (
    <div>
      <p>X: {score.X}</p>
      <p>O: {score.O}</p>
    </div>
  );
}

export default GameScore;
