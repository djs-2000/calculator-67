import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

type ModulePhaseState = 'READ_FIRST' | 'ACTIVE' | 'PAUSED' | 'COMPLETE';
const GRID_DIMENSION = 18;

export const GridPathCanvas: React.FC = () => {
  const [moduleState, setModuleState] = useState<ModulePhaseState>('READ_FIRST');
  const [sequence, setSequence] = useState<Array<[number, number]>>([
    [9, 9],
    [8, 9],
    [7, 9],
  ]);
  const [targetNode, setTargetNode] = useState<[number, number]>([13, 9]);
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [benchmark, setBenchmark] = useState(() =>
    Number(localStorage.getItem('calc_grid_path_benchmark') || '0')
  );
  const vectorRef = useRef<[number, number]>([1, 0]);

  const phaseNumber = Math.floor(accuracyRate / 50) + 1;

  const selectTargetCoordinate = useCallback(
    (occupied: Array<[number, number]>): [number, number] => {
      while (true) {
        const fx = Math.floor(Math.random() * GRID_DIMENSION);
        const fy = Math.floor(Math.random() * GRID_DIMENSION);
        if (!occupied.some(([x, y]) => x === fx && y === fy)) return [fx, fy];
      }
    },
    []
  );

  const initializeModule = useCallback(() => {
    const initialSequence: Array<[number, number]> = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    setSequence(initialSequence);
    setTargetNode([13, 9]);
    vectorRef.current = [1, 0];
    setAccuracyRate(0);
    setModuleState('ACTIVE');
  }, []);

  const updateTrajectoryVector = useCallback((next: [number, number]) => {
    const [cx, cy] = vectorRef.current;
    if (cx + next[0] === 0 && cy + next[1] === 0) return;
    vectorRef.current = next;
  }, []);

  useEffect(() => {
    const handleKeyInput = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        updateTrajectoryVector([0, -1]);
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        updateTrajectoryVector([0, 1]);
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        updateTrajectoryVector([-1, 0]);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        updateTrajectoryVector([1, 0]);
      }
    };
    window.addEventListener('keydown', handleKeyInput);
    return () => window.removeEventListener('keydown', handleKeyInput);
  }, [updateTrajectoryVector]);

  useEffect(() => {
    if (moduleState !== 'ACTIVE') return;

    const moduleCycle = () => {
      setSequence((prev) => {
        const [hx, hy] = prev[0];
        const [dx, dy] = vectorRef.current;
        const nx = hx + dx;
        const ny = hy + dy;

        if (
          nx < 0 ||
          nx >= GRID_DIMENSION ||
          ny < 0 ||
          ny >= GRID_DIMENSION ||
          prev.some(([x, y]) => x === nx && y === ny)
        ) {
          setModuleState('COMPLETE');
          return prev;
        }

        const nextSequence: Array<[number, number]> = [[nx, ny], ...prev];
        if (nx === targetNode[0] && ny === targetNode[1]) {
          setAccuracyRate((current) => {
            const nextRate = current + 10;
            if (nextRate > benchmark) {
              setBenchmark(nextRate);
              localStorage.setItem('calc_grid_path_benchmark', String(nextRate));
            }
            return nextRate;
          });
          setTargetNode(selectTargetCoordinate(nextSequence));
        } else {
          nextSequence.pop();
        }
        return nextSequence;
      });
    };

    const timer = setInterval(moduleCycle, 125);
    return () => clearInterval(timer);
  }, [moduleState, targetNode, selectTargetCoordinate, benchmark]);

  return (
    <div
      className="flex flex-col items-center gap-4 bg-white py-2"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <div className="w-full max-w-[380px] border-b border-[#e0e0e0] pb-2 flex items-center justify-between text-xs">
        <div>
          <span className="italic text-[#555555]">Interactive Module 1 · </span>
          <span>Coordinate Path Diagram</span>
        </div>
        <span>Phase: {phaseNumber}</span>
      </div>

      <div className="w-full max-w-[380px] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span>
            Accuracy Rate: <strong>{accuracyRate}</strong>
          </span>
          <span className="text-[#555555]">
            Benchmark: <strong>{benchmark}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {moduleState === 'ACTIVE' ? (
            <button
              type="button"
              onClick={() => setModuleState('PAUSED')}
              className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Pause Observation
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                moduleState === 'PAUSED' ? setModuleState('ACTIVE') : initializeModule()
              }
              className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              {moduleState === 'PAUSED' ? 'Resume Observation' : 'Begin Exercise'}
            </button>
          )}
          <button
            type="button"
            onClick={initializeModule}
            className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#555555]"
          >
            New Phase
          </button>
        </div>
      </div>

      <div
        className="relative grid bg-white border border-[#cccccc] p-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_DIMENSION}, minmax(0, 1fr))`,
          width: 'min(100%, 380px)',
          aspectRatio: '1 / 1',
        }}
      >
        {Array.from({ length: GRID_DIMENSION * GRID_DIMENSION }).map((_, idx) => {
          const x = idx % GRID_DIMENSION;
          const y = Math.floor(idx / GRID_DIMENSION);
          const isHead = sequence[0][0] === x && sequence[0][1] === y;
          const isBody = sequence.some(([sx, sy], i) => i > 0 && sx === x && sy === y);
          const isTarget = targetNode[0] === x && targetNode[1] === y;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isHead
                  ? '#333333'
                  : isBody
                    ? '#777777'
                    : isTarget
                      ? '#111111'
                      : '#ffffff',
                border: isTarget ? '1px solid #ffffff' : '0.5px solid #f0f0f0',
              }}
            />
          );
        })}

        {moduleState === 'READ_FIRST' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#666666]">Read First</p>
            <h3 className="text-base font-normal text-[#333333]">
              Coordinate Transition Diagram
            </h3>
            <p className="text-xs text-[#4a4a4a] max-w-xs leading-relaxed">
              Review the transition constraints: use directional keys (Arrow keys or WASD)
              or the coordinate controls below to connect nodes without boundary or path
              intersections.
            </p>
            <button
              type="button"
              onClick={initializeModule}
              className="pt-2 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Launch Simulation →
            </button>
          </div>
        )}

        {moduleState === 'COMPLETE' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-base font-normal text-[#333333]">
              Phase {phaseNumber} Concluded
            </h3>
            <p className="text-xs text-[#4a4a4a]">
              Accuracy Rate: {accuracyRate} · Benchmark: {benchmark}
            </p>
            <button
              type="button"
              onClick={initializeModule}
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
          aria-label="Vector Up"
          onClick={() => updateTrajectoryVector([0, -1])}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <div />
        <button
          type="button"
          aria-label="Vector Left"
          onClick={() => updateTrajectoryVector([-1, 0])}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Vector Down"
          onClick={() => updateTrajectoryVector([0, 1])}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Vector Right"
          onClick={() => updateTrajectoryVector([1, 0])}
          className="h-9 bg-white hover:bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-[#333333] cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
