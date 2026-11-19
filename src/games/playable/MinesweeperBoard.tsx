import React, { useState } from 'react';
import { Flag, RotateCcw } from 'lucide-react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacent: number;
}

const SIZE = 9;
const MINES = 10;

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacent: 0,
    }))
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].isMine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

export const MinesweeperBoard: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard());
  const [flagMode, setFlagMode] = useState(false);
  const [status, setStatus] = useState<'PLAYING' | 'LOST' | 'WON'>('PLAYING');

  const flagCount = board.flat().filter((c) => c.isFlagged).length;

  const revealCell = (r: number, c: number) => {
    if (status !== 'PLAYING') return;

    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const target = next[r][c];

      if (flagMode) {
        if (!target.isRevealed) target.isFlagged = !target.isFlagged;
        return next;
      }

      if (target.isFlagged || target.isRevealed) return prev;

      if (target.isMine) {
        for (const row of next) {
          for (const cell of row) {
            if (cell.isMine) cell.isRevealed = true;
          }
        }
        setStatus('LOST');
        return next;
      }

      const flood = (sr: number, sc: number) => {
        const stack: Array<[number, number]> = [[sr, sc]];
        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          const cell = next[cr][cc];
          if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;
          cell.isRevealed = true;
          if (cell.adjacent === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = cr + dr;
                const nc = cc + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
                  stack.push([nr, nc]);
                }
              }
            }
          }
        }
      };

      flood(r, c);

      const safeRemaining = next
        .flat()
        .filter((cell) => !cell.isMine && !cell.isRevealed).length;
      if (safeRemaining === 0) {
        setStatus('WON');
      }

      return next;
    });
  };

  const toggleFlagRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'PLAYING') return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (!next[r][c].isRevealed) {
        next[r][c].isFlagged = !next[r][c].isFlagged;
      }
      return next;
    });
  };

  const reset = () => {
    setBoard(createBoard());
    setStatus('PLAYING');
    setFlagMode(false);
  };

  const numColor = (n: number) => {
    if (n === 1) return 'text-blue-700';
    if (n === 2) return 'text-emerald-700';
    if (n === 3) return 'text-red-600';
    return 'text-slate-900';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[360px] flex items-center justify-between gap-2">
        <div className="text-sm font-mono-num text-slate-700">
          Mines: <strong className="text-slate-900">{MINES - flagCount}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFlagMode((f) => !f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 border transition-colors ${
              flagMode
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            {flagMode ? 'Flag On' : 'Flag'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-1 p-2 bg-slate-200 border border-slate-300 rounded-lg">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlagRightClick(e, r, c)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded text-sm font-mono-num font-bold flex items-center justify-center border transition-colors ${
                cell.isRevealed
                  ? cell.isMine
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'bg-slate-50 border-slate-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 shadow-2xs'
              } ${cell.isRevealed && !cell.isMine ? numColor(cell.adjacent) : ''}`}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? '×'
                  : cell.adjacent > 0
                    ? cell.adjacent
                    : ''
                : cell.isFlagged
                  ? '⚑'
                  : ''}
            </button>
          ))
        )}
      </div>

      {status !== 'PLAYING' && (
        <div className="text-sm font-medium text-slate-900">
          {status === 'WON' ? 'Board cleared! All mines found.' : 'Mine hit — try again.'}
        </div>
      )}
    </div>
  );
};
