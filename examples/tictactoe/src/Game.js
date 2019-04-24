import React from 'react';
import GameControls from './GameControls';
import GameBoard from './GameBoard';
import GameScore from './GameScore';

const Game = () => {
  return (
    <div className="game">
      <GameControls />
      <GameBoard />
      <GameScore />
    </div>
  );
}

export default Game;