import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

function createEmptyBoard(): number[][] {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function addRandomTile(board: number[][]): number[][] {
  const empty: Array<[number, number]> = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRowLeft(row: number[]): { row: number[]; points: number } {
  const nonZero = row.filter((n) => n !== 0);
  const out: number[] = [];
  let points = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i] * 2;
      out.push(merged);
      points += merged;
      i++;
    } else {
      out.push(nonZero[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, points };
}

function rotateClockwise(board: number[][]): number[][] {
  const next = createEmptyBoard();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[c][3 - r] = board[r][c];
    }
  }
  return next;
}

function canMove(board: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return true;
      if (r < 3 && board[r][c] === board[r + 1][c]) return true;
      if (c < 3 && board[r][c] === board[r][c + 1]) return true;
    }
  }
  return false;
}

const TILE_STYLES: Record<number, string> = {
  0: 'bg-slate-100 text-transparent border-slate-200',
  2: 'bg-white text-slate-900 border-slate-300',
  4: 'bg-slate-50 text-slate-900 border-slate-300',
  8: 'bg-amber-100 text-amber-950 border-amber-300',
  16: 'bg-amber-200 text-amber-950 border-amber-400',
  32: 'bg-orange-200 text-orange-950 border-orange-400',
  64: 'bg-red-200 text-red-950 border-red-400',
  128: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  256: 'bg-emerald-200 text-emerald-950 border-emerald-400',
  512: 'bg-sky-200 text-sky-950 border-sky-400',
  1024: 'bg-indigo-200 text-indigo-950 border-indigo-400',
  2048: 'bg-slate-900 text-white border-slate-900',
};

export const Puzzle2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() =>
    addRandomTile(addRandomTile(createEmptyBoard()))
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    Number(localStorage.getItem('calc_2048_best') || '0')
  );

  const gameOver = !canMove(board);

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      setBoard((prev) => {
        let rotated = prev.map((r) => [...r]);
        const rotations =
          direction === 'left'
            ? 0
            : direction === 'down'
              ? 1
              : direction === 'right'
                ? 2
                : 3;
        for (let i = 0; i < rotations; i++) rotated = rotateClockwise(rotated);

        let gained = 0;
        const slid = rotated.map((row) => {
          const res = slideRowLeft(row);
          gained += res.points;
          return res.row;
        });

        let restored = slid;
        for (let i = 0; i < (4 - rotations) % 4; i++) {
          restored = rotateClockwise(restored);
        }

        if (JSON.stringify(prev) === JSON.stringify(restored)) return prev;

        if (gained > 0) {
          setScore((s) => {
            const next = s + gained;
            if (next > bestScore) {
              setBestScore(next);
              localStorage.setItem('calc_2048_best', String(next));
            }
            return next;
          });
        }
        return addRandomTile(restored);
      });
    },
    [bestScore]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        move('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        move('right');
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        move('up');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        move('down');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  const reset = () => {
    setBoard(addRandomTile(addRandomTile(createEmptyBoard())));
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[360px] flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-mono-num text-slate-700">
          <span>
            Score: <strong className="text-slate-900">{score}</strong>
          </span>
          <span className="text-slate-500">
            Best: <strong className="text-slate-700">{bestScore}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={reset}
          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="relative grid grid-cols-4 gap-2 p-2.5 bg-slate-200/70 border border-slate-300 rounded-lg w-full max-w-[360px] aspect-square">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`rounded-md border font-mono-num font-bold text-xl flex items-center justify-center transition-colors ${
              TILE_STYLES[val] ?? 'bg-slate-900 text-white border-slate-900'
            }`}
          >
            {val > 0 ? val : ''}
          </div>
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No Moves Left</h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">
              Final Score: {score}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 w-36">
        <div />
        <button
          type="button"
          aria-label="Slide Up"
          onClick={() => move('up')}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button
          type="button"
          aria-label="Slide Left"
          onClick={() => move('left')}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Slide Down"
          onClick={() => move('down')}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Slide Right"
          onClick={() => move('right')}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
