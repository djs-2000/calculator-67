import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

type ModuleState = 'READY' | 'ACTIVE' | 'PAUSED' | 'COMPLETE';
const GRID_SIZE = 18;

export const GridPathCanvas: React.FC = () => {
  const [moduleState, setModuleState] = useState<ModuleState>('READY');
  const [trail, setTrail] = useState<Array<[number, number]>>([
    [9, 9],
    [8, 9],
    [7, 9],
  ]);
  const [target, setTarget] = useState<[number, number]>([13, 9]);
  const [metric, setMetric] = useState(0);
  const [bestMetric, setBestMetric] = useState(() =>
    Number(localStorage.getItem('calc_grid_path_peak') || '0')
  );
  const dirRef = useRef<[number, number]>([1, 0]);

  const spawnTarget = useCallback((body: Array<[number, number]>): [number, number] => {
    while (true) {
      const fx = Math.floor(Math.random() * GRID_SIZE);
      const fy = Math.floor(Math.random() * GRID_SIZE);
      if (!body.some(([x, y]) => x === fx && y === fy)) return [fx, fy];
    }
  }, []);

  const startActivity = useCallback(() => {
    const initial: Array<[number, number]> = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    setTrail(initial);
    setTarget([13, 9]);
    dirRef.current = [1, 0];
    setMetric(0);
    setModuleState('ACTIVE');
  }, []);

  const setDirection = useCallback((next: [number, number]) => {
    const [cx, cy] = dirRef.current;
    if (cx + next[0] === 0 && cy + next[1] === 0) return;
    dirRef.current = next;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        setDirection([0, -1]);
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        setDirection([0, 1]);
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        setDirection([-1, 0]);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        setDirection([1, 0]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setDirection]);

  useEffect(() => {
    if (moduleState !== 'ACTIVE') return;
    const timer = setInterval(() => {
      setTrail((prev) => {
        const [hx, hy] = prev[0];
        const [dx, dy] = dirRef.current;
        const nx = hx + dx;
        const ny = hy + dy;

        if (
          nx < 0 ||
          nx >= GRID_SIZE ||
          ny < 0 ||
          ny >= GRID_SIZE ||
          prev.some(([x, y]) => x === nx && y === ny)
        ) {
          setModuleState('COMPLETE');
          return prev;
        }

        const nextBody: Array<[number, number]> = [[nx, ny], ...prev];
        if (nx === target[0] && ny === target[1]) {
          setMetric((s) => {
            const nextMetric = s + 10;
            if (nextMetric > bestMetric) {
              setBestMetric(nextMetric);
              localStorage.setItem('calc_grid_path_peak', String(nextMetric));
            }
            return nextMetric;
          });
          setTarget(spawnTarget(nextBody));
        } else {
          nextBody.pop();
        }
        return nextBody;
      });
    }, 125);

    return () => clearInterval(timer);
  }, [moduleState, target, spawnTarget, bestMetric]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[380px] border-b border-slate-200 pb-2.5 text-center sm:text-left">
        <div className="text-xs font-medium text-slate-500">
          Critical Thinking Exercise #1
        </div>
        <div className="text-sm font-semibold text-slate-900">
          Coordinate Grid Pathing Module
        </div>
      </div>

      <div className="w-full max-w-[380px] flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs sm:text-sm font-mono-num text-slate-700">
          <span>
            Performance Metric: <strong className="text-slate-900">{metric}</strong>
          </span>
          <span className="text-slate-500">
            Best: <strong className="text-slate-700">{bestMetric}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {moduleState === 'ACTIVE' ? (
            <button
              type="button"
              onClick={() => setModuleState('PAUSED')}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                moduleState === 'PAUSED' ? setModuleState('ACTIVE') : startActivity()
              }
              className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {moduleState === 'PAUSED' ? 'Resume' : 'Begin Activity'}
            </button>
          )}
          <button
            type="button"
            onClick={startActivity}
            aria-label="Reset Exercise"
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="relative grid bg-slate-100 border border-slate-300 rounded-md p-1.5"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(100%, 380px)',
          aspectRatio: '1 / 1',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isHead = trail[0][0] === x && trail[0][1] === y;
          const isBody = trail.some(([sx, sy], i) => i > 0 && sx === x && sy === y);
          const isTarget = target[0] === x && target[1] === y;

          return (
            <div
              key={idx}
              className={`rounded-[1px] m-[0.5px] ${
                isHead
                  ? 'bg-slate-900'
                  : isBody
                    ? 'bg-slate-600'
                    : isTarget
                      ? 'bg-slate-800 ring-1 ring-inset ring-white'
                      : 'bg-white'
              }`}
            />
          );
        })}

        {moduleState === 'READY' && (
          <div className="absolute inset-0 bg-white/95 rounded-md flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              Interactive Module Instructions
            </h3>
            <p className="mt-1 text-xs text-slate-600 max-w-xs">
              Steer across the grid using Arrow keys, WASD, or the directional controls
              below while avoiding self-intersections.
            </p>
            <button
              type="button"
              onClick={startActivity}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Begin Activity
            </button>
          </div>
        )}

        {moduleState === 'COMPLETE' && (
          <div className="absolute inset-0 bg-white/95 rounded-md flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-base font-semibold text-slate-900">Exercise Complete</h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">
              Performance Metric: {metric}
            </p>
            <button
              type="button"
              onClick={startActivity}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Reset Exercise
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 w-36">
        <div />
        <button
          type="button"
          aria-label="Move Up"
          onClick={() => setDirection([0, -1])}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button
          type="button"
          aria-label="Move Left"
          onClick={() => setDirection([-1, 0])}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Move Down"
          onClick={() => setDirection([0, 1])}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Move Right"
          onClick={() => setDirection([1, 0])}
          className="h-10 rounded-md bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
