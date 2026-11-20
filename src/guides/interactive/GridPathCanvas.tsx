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

type SimState = 'READY' | 'RUNNING' | 'PAUSED' | 'COMPLETE';
const GRID_SIZE = 18;

export const GridPathCanvas: React.FC = () => {
  const [simState, setSimState] = useState<SimState>('READY');
  const [trail, setTrail] = useState<Array<[number, number]>>([
    [9, 9],
    [8, 9],
    [7, 9],
  ]);
  const [target, setTarget] = useState<[number, number]>([13, 9]);
  const [points, setPoints] = useState(0);
  const [peakPoints, setPeakPoints] = useState(() =>
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

  const startDemo = useCallback(() => {
    const initial: Array<[number, number]> = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    setTrail(initial);
    setTarget([13, 9]);
    dirRef.current = [1, 0];
    setPoints(0);
    setSimState('RUNNING');
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
    if (simState !== 'RUNNING') return;
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
          setSimState('COMPLETE');
          return prev;
        }

        const nextBody: Array<[number, number]> = [[nx, ny], ...prev];
        if (nx === target[0] && ny === target[1]) {
          setPoints((s) => {
            const nextPoints = s + 10;
            if (nextPoints > peakPoints) {
              setPeakPoints(nextPoints);
              localStorage.setItem('calc_grid_path_peak', String(nextPoints));
            }
            return nextPoints;
          });
          setTarget(spawnTarget(nextBody));
        } else {
          nextBody.pop();
        }
        return nextBody;
      });
    }, 125);

    return () => clearInterval(timer);
  }, [simState, target, spawnTarget, peakPoints]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[380px] flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-mono-num text-slate-700">
          <span>
            Points: <strong className="text-slate-900">{points}</strong>
          </span>
          <span className="text-slate-500">
            Peak: <strong className="text-slate-700">{peakPoints}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {simState === 'RUNNING' ? (
            <button
              type="button"
              onClick={() => setSimState('PAUSED')}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                simState === 'PAUSED' ? setSimState('RUNNING') : startDemo()
              }
              className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {simState === 'PAUSED' ? 'Resume' : 'Start Demo'}
            </button>
          )}
          <button
            type="button"
            onClick={startDemo}
            aria-label="Restart Grid Path Demo"
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="relative grid bg-slate-50 border border-slate-300 rounded-lg p-1.5"
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
              className={`rounded-[2px] m-[0.5px] ${
                isHead
                  ? 'bg-emerald-700'
                  : isBody
                    ? 'bg-emerald-600/80'
                    : isTarget
                      ? 'bg-red-600'
                      : 'bg-white'
              }`}
            />
          );
        })}

        {simState === 'READY' && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Grid Pathing Guide</h3>
            <p className="mt-1 text-xs text-slate-600 max-w-xs">
              Practice turns and loop-avoidance pathing using Arrow keys, WASD, or the
              directional controls below.
            </p>
            <button
              type="button"
              onClick={startDemo}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Start Walkthrough
            </button>
          </div>
        )}

        {simState === 'COMPLETE' && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Run Complete</h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">
              Final Points: {points}
            </p>
            <button
              type="button"
              onClick={startDemo}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Restart Demo
            </button>
          </div>
        )}
      </div>

      {/* Directional Controls */}
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
