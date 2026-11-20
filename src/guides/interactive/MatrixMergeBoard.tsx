import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

function initializeEmptyMatrix(): number[][] {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function seedMatrixEntry(matrix: number[][]): number[][] {
  const available: Array<[number, number]> = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (matrix[r][c] === 0) available.push([r, c]);
    }
  }
  if (available.length === 0) return matrix;
  const [r, c] = available[Math.floor(Math.random() * available.length)];
  const next = matrix.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function consolidateRowLeft(row: number[]): { row: number[]; increment: number } {
  const nonZero = row.filter((n) => n !== 0);
  const out: number[] = [];
  let increment = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i] * 2;
      out.push(merged);
      increment += merged;
      i++;
    } else {
      out.push(nonZero[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, increment };
}

function transposeClockwise(matrix: number[][]): number[][] {
  const next = initializeEmptyMatrix();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[c][3 - r] = matrix[r][c];
    }
  }
  return next;
}

function evaluateAvailableTransitions(matrix: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (matrix[r][c] === 0) return true;
      if (r < 3 && matrix[r][c] === matrix[r + 1][c]) return true;
      if (c < 3 && matrix[r][c] === matrix[r][c + 1]) return true;
    }
  }
  return false;
}

const CELL_TONES: Record<number, string> = {
  0: 'bg-white text-transparent border-[#e5e5e5]',
  2: 'bg-[#fafafa] text-[#333333] border-[#d4d4d4]',
  4: 'bg-[#f4f4f4] text-[#333333] border-[#cccccc]',
  8: 'bg-[#ececec] text-[#333333] border-[#c2c2c2]',
  16: 'bg-[#e2e2e2] text-[#333333] border-[#b8b8b8]',
  32: 'bg-[#d4d4d4] text-[#222222] border-[#a3a3a3]',
  64: 'bg-[#bdbdbd] text-[#111111] border-[#8c8c8c]',
  128: 'bg-[#737373] text-white border-[#525252]',
  256: 'bg-[#525252] text-white border-[#404040]',
  512: 'bg-[#404040] text-white border-[#262626]',
  1024: 'bg-[#262626] text-white border-[#171717]',
  2048: 'bg-[#171717] text-white border-[#171717]',
};

export const MatrixMergeBoard: React.FC = () => {
  const [readFirstPending, setReadFirstPending] = useState(true);
  const [matrix, setMatrix] = useState<number[][]>(() =>
    seedMatrixEntry(seedMatrixEntry(initializeEmptyMatrix()))
  );
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [benchmark, setBenchmark] = useState(() =>
    Number(localStorage.getItem('calc_powers_merge_benchmark') || '0')
  );

  const stalled = !evaluateAvailableTransitions(matrix);
  const maxEntry = Math.max(...matrix.flat());
  const currentPhase = Math.max(1, Math.floor(Math.log2(Math.max(2, maxEntry))) - 1);

  const executeMatrixShift = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (readFirstPending) return;
      setMatrix((prev) => {
        let rotated = prev.map((r) => [...r]);
        const rotations =
          direction === 'left'
            ? 0
            : direction === 'down'
              ? 1
              : direction === 'right'
                ? 2
                : 3;
        for (let i = 0; i < rotations; i++) rotated = transposeClockwise(rotated);

        let gained = 0;
        const consolidated = rotated.map((row) => {
          const res = consolidateRowLeft(row);
          gained += res.increment;
          return res.row;
        });

        let restored = consolidated;
        for (let i = 0; i < (4 - rotations) % 4; i++) {
          restored = transposeClockwise(restored);
        }

        if (JSON.stringify(prev) === JSON.stringify(restored)) return prev;

        if (gained > 0) {
          setAccuracyRate((current) => {
            const next = current + gained;
            if (next > benchmark) {
              setBenchmark(next);
              localStorage.setItem('calc_powers_merge_benchmark', String(next));
            }
            return next;
          });
        }
        return seedMatrixEntry(restored);
      });
    },
    [benchmark, readFirstPending]
  );

  useEffect(() => {
    const handleKeyInput = (e: KeyboardEvent) => {
      if (readFirstPending) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        executeMatrixShift('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        executeMatrixShift('right');
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        executeMatrixShift('up');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        executeMatrixShift('down');
      }
    };
    window.addEventListener('keydown', handleKeyInput);
    return () => window.removeEventListener('keydown', handleKeyInput);
  }, [executeMatrixShift, readFirstPending]);

  const initializeNewPhase = () => {
    setMatrix(seedMatrixEntry(seedMatrixEntry(initializeEmptyMatrix())));
    setAccuracyRate(0);
    setReadFirstPending(false);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 bg-white py-2"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <div className="w-full max-w-[360px] border-b border-[#e0e0e0] pb-2 flex items-center justify-between text-xs">
        <div>
          <span className="italic text-[#555555]">Interactive Module 2 · </span>
          <span>Exponential Matrix Diagram</span>
        </div>
        <span>Phase: {currentPhase}</span>
      </div>

      <div className="w-full max-w-[360px] flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span>
            Accuracy Rate: <strong>{accuracyRate}</strong>
          </span>
          <span className="text-[#555555]">
            Benchmark: <strong>{benchmark}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={initializeNewPhase}
          className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
        >
          New Phase
        </button>
      </div>

      <div className="relative grid grid-cols-4 gap-2 p-2 bg-white border border-[#cccccc] w-full max-w-[360px] aspect-square">
        {matrix.flat().map((val, idx) => (
          <div
            key={idx}
            className={`border font-normal text-lg flex items-center justify-center ${
              CELL_TONES[val] ?? 'bg-[#171717] text-white border-[#171717]'
            }`}
          >
            {val > 0 ? val : ''}
          </div>
        ))}

        {readFirstPending && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#666666]">Read First</p>
            <h3 className="text-base font-normal text-[#333333]">
              Exponential Matrix Consolidation
            </h3>
            <p className="text-xs text-[#4a4a4a] max-w-xs leading-relaxed">
              Adjacent equal powers of two consolidate along directional vector shifts
              (Arrow keys, WASD, or the directional controls below).
            </p>
            <button
              type="button"
              onClick={() => setReadFirstPending(false)}
              className="pt-2 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Begin Exercise →
            </button>
          </div>
        )}

        {stalled && !readFirstPending && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-base font-normal text-[#333333]">
              Phase {currentPhase} Concluded
            </h3>
            <p className="text-xs text-[#4a4a4a]">
              Accuracy Rate: {accuracyRate} · Benchmark: {benchmark}
            </p>
            <button
              type="button"
              onClick={initializeNewPhase}
              className="pt-2 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Begin Exercise →
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 w-32">
        <div />
        <button
          type="button"
          aria-label="Shift Up"
          onClick={() => executeMatrixShift('up')}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <div />
        <button
          type="button"
          aria-label="Shift Left"
          onClick={() => executeMatrixShift('left')}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Shift Down"
          onClick={() => executeMatrixShift('down')}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Shift Right"
          onClick={() => executeMatrixShift('right')}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
