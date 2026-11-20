import React, { useState } from 'react';

interface MatrixCell {
  isConstraint: boolean;
  isInspected: boolean;
  isFlagged: boolean;
  adjacentCount: number;
}

const DIMENSION = 9;
const CONSTRAINT_TOTAL = 10;

function constructAdjacencyMatrix(): MatrixCell[][] {
  const matrix: MatrixCell[][] = Array.from({ length: DIMENSION }, () =>
    Array.from({ length: DIMENSION }, () => ({
      isConstraint: false,
      isInspected: false,
      isFlagged: false,
      adjacentCount: 0,
    }))
  );

  let assigned = 0;
  while (assigned < CONSTRAINT_TOTAL) {
    const r = Math.floor(Math.random() * DIMENSION);
    const c = Math.floor(Math.random() * DIMENSION);
    if (!matrix[r][c].isConstraint) {
      matrix[r][c].isConstraint = true;
      assigned++;
    }
  }

  for (let r = 0; r < DIMENSION; r++) {
    for (let c = 0; c < DIMENSION; c++) {
      if (matrix[r][c].isConstraint) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < DIMENSION &&
            nc >= 0 &&
            nc < DIMENSION &&
            matrix[nr][nc].isConstraint
          ) {
            count++;
          }
        }
      }
      matrix[r][c].adjacentCount = count;
    }
  }

  return matrix;
}

export const DeductionGrid: React.FC = () => {
  const [readFirstPending, setReadFirstPending] = useState(true);
  const [matrix, setMatrix] = useState<MatrixCell[][]>(() => constructAdjacencyMatrix());
  const [annotationMode, setAnnotationMode] = useState(false);
  const [phaseStatus, setPhaseStatus] = useState<'ACTIVE' | 'CONCLUDED' | 'VERIFIED'>(
    'ACTIVE'
  );
  const [phaseNumber, setPhaseNumber] = useState(1);
  const [benchmark, setBenchmark] = useState(() =>
    Number(localStorage.getItem('calc_deduction_benchmark') || '0')
  );

  const flaggedCount = matrix.flat().filter((c) => c.isFlagged).length;
  const inspectedValid = matrix
    .flat()
    .filter((c) => c.isInspected && !c.isConstraint).length;
  const totalValid = DIMENSION * DIMENSION - CONSTRAINT_TOTAL;
  const accuracyRate = Math.round((inspectedValid / totalValid) * 100);

  const updateBenchmarkIfNeeded = (nextValid: number) => {
    const nextRate = Math.round((nextValid / totalValid) * 100);
    if (nextRate > benchmark) {
      setBenchmark(nextRate);
      localStorage.setItem('calc_deduction_benchmark', String(nextRate));
    }
  };

  const evaluateCellCoordinate = (r: number, c: number) => {
    if (readFirstPending || phaseStatus !== 'ACTIVE') return;

    setMatrix((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const target = next[r][c];

      if (annotationMode) {
        if (!target.isInspected) target.isFlagged = !target.isFlagged;
        return next;
      }

      if (target.isFlagged || target.isInspected) return prev;

      if (target.isConstraint) {
        for (const row of next) {
          for (const cell of row) {
            if (cell.isConstraint) cell.isInspected = true;
          }
        }
        setPhaseStatus('CONCLUDED');
        return next;
      }

      const propagateZeroRegion = (sr: number, sc: number) => {
        const stack: Array<[number, number]> = [[sr, sc]];
        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          const cell = next[cr][cc];
          if (cell.isInspected || cell.isFlagged || cell.isConstraint) continue;
          cell.isInspected = true;
          if (cell.adjacentCount === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = cr + dr;
                const nc = cc + dc;
                if (nr >= 0 && nr < DIMENSION && nc >= 0 && nc < DIMENSION) {
                  stack.push([nr, nc]);
                }
              }
            }
          }
        }
      };

      propagateZeroRegion(r, c);

      const nextValid = next
        .flat()
        .filter((cell) => !cell.isConstraint && cell.isInspected).length;
      updateBenchmarkIfNeeded(nextValid);

      const remainingValid = totalValid - nextValid;
      if (remainingValid === 0) {
        setPhaseStatus('VERIFIED');
      }

      return next;
    });
  };

  const toggleIndicatorRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (readFirstPending || phaseStatus !== 'ACTIVE') return;
    setMatrix((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (!next[r][c].isInspected) {
        next[r][c].isFlagged = !next[r][c].isFlagged;
      }
      return next;
    });
  };

  const initializeNewMatrix = () => {
    setMatrix(constructAdjacencyMatrix());
    setPhaseStatus('ACTIVE');
    setAnnotationMode(false);
    setPhaseNumber((n) => n + 1);
    setReadFirstPending(false);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 bg-white py-2"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <div className="w-full max-w-[360px] border-b border-[#e0e0e0] pb-2 flex items-center justify-between text-xs">
        <div>
          <span className="italic text-[#555555]">Interactive Module 4 · </span>
          <span>Adjacency Deduction Table</span>
        </div>
        <span>Phase: {phaseNumber}</span>
      </div>

      <div className="w-full max-w-[360px] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span>
            Accuracy Rate: <strong>{accuracyRate}%</strong>
          </span>
          <span className="text-[#555555]">
            Benchmark: <strong>{benchmark}%</strong>
          </span>
          <span className="text-[#555555]">
            Unmarked: <strong>{CONSTRAINT_TOTAL - flaggedCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setAnnotationMode((f) => !f)}
            className={`underline underline-offset-4 bg-transparent p-0 cursor-pointer ${
              annotationMode ? 'font-bold text-black' : 'text-[#555555]'
            }`}
          >
            {annotationMode ? 'Marker: Active' : 'Marker: Off'}
          </button>
          <button
            type="button"
            onClick={initializeNewMatrix}
            className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
          >
            New Phase
          </button>
        </div>
      </div>

      <div className="relative grid grid-cols-9 gap-1 p-2 bg-white border border-[#cccccc]">
        {matrix.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => evaluateCellCoordinate(r, c)}
              onContextMenu={(e) => toggleIndicatorRightClick(e, r, c)}
              className={`w-8 h-8 sm:w-9 sm:h-9 text-sm font-normal flex items-center justify-center border cursor-pointer ${
                cell.isInspected
                  ? cell.isConstraint
                    ? 'bg-[#333333] border-[#333333] text-white'
                    : 'bg-[#f7f7f7] border-[#e0e0e0] text-[#333333]'
                  : 'bg-white hover:bg-[#f2f2f2] border-[#cccccc] text-[#333333]'
              }`}
            >
              {cell.isInspected
                ? cell.isConstraint
                  ? '×'
                  : cell.adjacentCount > 0
                    ? cell.adjacentCount
                    : ''
                : cell.isFlagged
                  ? '⚑'
                  : ''}
            </button>
          ))
        )}

        {readFirstPending && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#666666]">Read First</p>
            <h3 className="text-base font-normal text-[#333333]">
              Relational Adjacency Inference
            </h3>
            <p className="text-xs text-[#4a4a4a] max-w-xs leading-relaxed">
              Each numerical indicator reports how many of its eight neighboring coordinates
              contain hidden constraint nodes. Deduce valid cells without triggering a
              constraint.
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
      </div>

      {phaseStatus !== 'ACTIVE' && (
        <div className="text-xs text-[#333333] text-center space-y-1">
          <p>
            {phaseStatus === 'VERIFIED'
              ? `Phase ${phaseNumber} verified: all ${totalValid} valid cells inspected.`
              : `Constraint node encountered in Phase ${phaseNumber}. Accuracy Rate: ${accuracyRate}%.`}
          </p>
          <button
            type="button"
            onClick={initializeNewMatrix}
            className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
          >
            Begin Exercise →
          </button>
        </div>
      )}
    </div>
  );
};
