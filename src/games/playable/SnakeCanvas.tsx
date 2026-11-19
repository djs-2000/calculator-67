import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
const GRID_SIZE = 18;

export const SnakeCanvas: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [snake, setSnake] = useState<Array<[number, number]>>([
    [9, 9],
    [8, 9],
    [7, 9],
  ]);
  const [food, setFood] = useState<[number, number]>([13, 9]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    Number(localStorage.getItem('calc_snake_best') || '0')
  );
  const dirRef = useRef<[number, number]>([1, 0]);

  const spawnFood = useCallback((body: Array<[number, number]>): [number, number] => {
    while (true) {
      const fx = Math.floor(Math.random() * GRID_SIZE);
      const fy = Math.floor(Math.random() * GRID_SIZE);
      if (!body.some(([x, y]) => x === fx && y === fy)) return [fx, fy];
    }
  }, []);

  const startNewGame = useCallback(() => {
    const initial: Array<[number, number]> = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    setSnake(initial);
    setFood([13, 9]);
    dirRef.current = [1, 0];
    setScore(0);
    setGameState('PLAYING');
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
    if (gameState !== 'PLAYING') return;
    const timer = setInterval(() => {
      setSnake((prev) => {
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
          setGameState('GAME_OVER');
          return prev;
        }

        const nextBody: Array<[number, number]> = [[nx, ny], ...prev];
        if (nx === food[0] && ny === food[1]) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > bestScore) {
              setBestScore(nextScore);
              localStorage.setItem('calc_snake_best', String(nextScore));
            }
            return nextScore;
          });
          setFood(spawnFood(nextBody));
        } else {
          nextBody.pop();
        }
        return nextBody;
      });
    }, 125);

    return () => clearInterval(timer);
  }, [gameState, food, spawnFood, bestScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[380px] flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-mono-num text-slate-700">
          <span>
            Score: <strong className="text-slate-900">{score}</strong>
          </span>
          <span className="text-slate-500">
            Best: <strong className="text-slate-700">{bestScore}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameState === 'PLAYING' ? (
            <button
              type="button"
              onClick={() => setGameState('PAUSED')}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                gameState === 'PAUSED' ? setGameState('PLAYING') : startNewGame()
              }
              className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {gameState === 'PAUSED' ? 'Resume' : 'Start Game'}
            </button>
          )}
          <button
            type="button"
            onClick={startNewGame}
            aria-label="Restart Snake"
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
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isBody = snake.some(([sx, sy], i) => i > 0 && sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={idx}
              className={`rounded-[2px] m-[0.5px] ${
                isHead
                  ? 'bg-emerald-700'
                  : isBody
                    ? 'bg-emerald-600/80'
                    : isFood
                      ? 'bg-red-600'
                      : 'bg-white'
              }`}
            />
          );
        })}

        {gameState === 'TITLE_MENU' && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Classic Snake</h3>
            <p className="mt-1 text-xs text-slate-600 max-w-xs">
              Use Arrow keys, WASD, or the directional buttons below to steer.
            </p>
            <button
              type="button"
              onClick={startNewGame}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Game Over</h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">
              Final Score: {score}
            </p>
            <button
              type="button"
              onClick={startNewGame}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen D-Pad */}
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
