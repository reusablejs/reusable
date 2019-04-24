import { reuseMemo, reuseEffect, reuseState, reuseCallback } from "reusable";
import { set, update } from 'lodash/fp';

const initialBoard = [new Array(3).fill(null), new Array(3).fill(null), new Array(3).fill(null)];
export const OPPONENT = {
  X: 'O',
  O: 'X'
};

const increment = prev => prev + 1;

export const gameUnit = () => {
  const [board, setBoard] = reuseState(initialBoard);
  const [firstPlayer, setFirstPlayer] = reuseState('X')
  const [score, setScore] = reuseState({ X: 0, O: 0 });

  const moves = reuseMemo(() =>
    board[0].filter(cell => cell).length +
    board[1].filter(cell => cell).length +
    board[2].filter(cell => cell).length
    , [board]);

  const currentPlayer = reuseMemo(() => moves % 2 ? OPPONENT[firstPlayer] : firstPlayer, [moves, firstPlayer]);
  const winner = reuseMemo(() => _boardHasWinner(board), [board]);

  const tie = reuseMemo(() => moves === 9 && !winner, [moves, winner]);
  const ended = reuseMemo(() => !!winner || tie, winner, tie);
  console.log({ ended, winner })
  const play = reuseCallback((row, col) => {
    if (ended) return;

    setBoard(set([row, col], currentPlayer))
  }, [ended, currentPlayer]);

  const resetGame = reuseCallback(() => {
    setFirstPlayer(OPPONENT[firstPlayer]);
    setBoard(initialBoard);
  }, []);

  reuseEffect(() => {
    if (winner) {
      setTimeout(() => setScore(update(winner, increment)));
    }
  }, [winner]);

  // return object with actions:
  return {
    board,
    currentPlayer,
    score,
    winner,
    tie,
    ended,
    play,
    resetGame
  };
}

const _rowHasWinner = (board, index) => {
  return (board[index][0] && board[index][0] === board[index][1] && board[index][1] === board[index][2]);
}

const _columnHasWinner = (board, index) => {
  return (board[0][index] && board[0][index] === board[1][index] && board[1][index] === board[2][index]);
}
const _boardHasWinner = (board) => {
  // rows:
  if (_rowHasWinner(board, 0)) return board[0][0];
  if (_rowHasWinner(board, 1)) return board[1][0];
  if (_rowHasWinner(board, 2)) return board[2][0];

  // columns:
  if (_columnHasWinner(board, 0)) return board[0][0];
  if (_columnHasWinner(board, 1)) return board[0][1];
  if (_columnHasWinner(board, 2)) return board[0][2];

  // diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];

  return null;
};
