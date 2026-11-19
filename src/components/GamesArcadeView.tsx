import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react';

type GameId = 'snake' | '2048' | 'breakout';

interface ScoreEntry {
  game: string;
  player: string;
  score: number;
  timestamp: number;
}

// ---------------- SNAKE GAME ----------------
const GRID_SIZE = 18;

const SnakeGame: React.FC<{ onSubmitScore: (game: GameId, score: number) => void }> = ({
  onSubmitScore,
}) => {
  const [snake, setSnake] = useState<Array<[number, number]>>([
    [9, 9],
    [8, 9],
    [7, 9],
  ]);
  const [food, setFood] = useState<[number, number]>([13, 9]);
  const [dir, setDir] = useState<[number, number]>([1, 0]);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const spawnFood = useCallback((body: Array<[number, number]>): [number, number] => {
    while (true) {
      const fx = Math.floor(Math.random() * GRID_SIZE);
      const fy = Math.floor(Math.random() * GRID_SIZE);
      if (!body.some(([x, y]) => x === fx && y === fy)) return [fx, fy];
    }
  }, []);

  const reset = () => {
    const initial: Array<[number, number]> = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    setSnake(initial);
    setFood([13, 9]);
    setDir([1, 0]);
    dirRef.current = [1, 0];
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  const changeDirection = useCallback((next: [number, number]) => {
    const [cx, cy] = dirRef.current;
    if (cx + next[0] === 0 && cy + next[1] === 0) return;
    setDir(next);
    dirRef.current = next;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        changeDirection([0, -1]);
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        changeDirection([0, 1]);
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        changeDirection([-1, 0]);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        changeDirection([1, 0]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDirection]);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
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
          setGameOver(true);
          setRunning(false);
          onSubmitScore('snake', score);
          return prev;
        }

        const nextBody: Array<[number, number]> = [[nx, ny], ...prev];
        if (nx === food[0] && ny === food[1]) {
          setScore((s) => s + 10);
          setFood(spawnFood(nextBody));
        } else {
          nextBody.pop();
        }
        return nextBody;
      });
    }, 125);
    return () => clearInterval(interval);
  }, [running, gameOver, food, spawnFood, onSubmitScore, score]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="text-sm font-mono-num">
          Score: <span className="text-emerald-400 font-bold">{score}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (gameOver ? reset() : setRunning((r) => !r))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
          >
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {gameOver ? 'Play Again' : running ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="relative grid bg-zinc-950 border border-zinc-800 rounded-xl p-1.5"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(100%, 360px)',
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
                  ? 'bg-emerald-400'
                  : isBody
                    ? 'bg-emerald-600/80'
                    : isFood
                      ? 'bg-rose-500'
                      : 'bg-zinc-900/40'
              }`}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/75 rounded-xl flex flex-col items-center justify-center gap-2">
            <p className="text-lg font-bold text-rose-400">Game Over</p>
            <p className="text-xs text-zinc-300 font-mono-num">Final Score: {score}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {/* Touch / Click D-Pad */}
      <div className="grid grid-cols-3 gap-1.5 w-36">
        <div />
        <button
          type="button"
          onClick={() => changeDirection([0, -1])}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex justify-center"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button
          type="button"
          onClick={() => changeDirection([-1, 0])}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => changeDirection([0, 1])}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex justify-center"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => changeDirection([1, 0])}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex justify-center"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ---------------- 2048 GAME ----------------
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
  const filtered = row.filter((n) => n !== 0);
  const result: number[] = [];
  let points = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      points += merged;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while (result.length < 4) result.push(0);
  return { row: result, points };
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

const TILE_COLORS: Record<number, string> = {
  0: 'bg-zinc-900/60 text-transparent',
  2: 'bg-zinc-800 text-zinc-100',
  4: 'bg-zinc-700 text-zinc-100',
  8: 'bg-amber-600/80 text-white',
  16: 'bg-amber-500 text-white',
  32: 'bg-orange-600 text-white',
  64: 'bg-rose-600 text-white',
  128: 'bg-emerald-600 text-white',
  256: 'bg-emerald-500 text-white',
  512: 'bg-teal-500 text-white',
  1024: 'bg-cyan-500 text-white',
  2048: 'bg-yellow-400 text-zinc-950',
};

const Game2048: React.FC<{ onSubmitScore: (game: GameId, score: number) => void }> = ({
  onSubmitScore,
}) => {
  const [board, setBoard] = useState<number[][]>(() =>
    addRandomTile(addRandomTile(createEmptyBoard()))
  );
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    setBoard((prev) => {
      let rotated = prev.map((r) => [...r]);
      const rotations =
        direction === 'left' ? 0 : direction === 'down' ? 1 : direction === 'right' ? 2 : 3;
      for (let i = 0; i < rotations; i++) rotated = rotateClockwise(rotated);

      let gained = 0;
      const slid = rotated.map((row) => {
        const res = slideRowLeft(row);
        gained += res.points;
        return res.row;
      });

      let restored = slid;
      for (let i = 0; i < (4 - rotations) % 4; i++) restored = rotateClockwise(restored);

      const changed = JSON.stringify(prev) !== JSON.stringify(restored);
      if (!changed) return prev;
      if (gained > 0) setScore((s) => s + gained);
      return addRandomTile(restored);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
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
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const reset = () => {
    setBoard(addRandomTile(addRandomTile(createEmptyBoard())));
    setScore(0);
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="text-sm font-mono-num">
          Score: <span className="text-emerald-400 font-bold">{score}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={submitted || score === 0}
            onClick={() => {
              onSubmitScore('2048', score);
              setSubmitted(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-medium transition"
          >
            {submitted ? 'Saved!' : 'Save Score'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-[340px] aspect-square">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`rounded-lg flex items-center justify-center font-mono-num font-bold text-xl transition-colors ${
              TILE_COLORS[val] ?? 'bg-purple-600 text-white'
            }`}
          >
            {val > 0 ? val : ''}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(['left', 'up', 'down', 'right'] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => move(d)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs capitalize text-zinc-300"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------------- BREAKOUT GAME ----------------
const BreakoutGame: React.FC<{ onSubmitScore: (game: GameId, score: number) => void }> = ({
  onSubmitScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    let paddleX = (W - 76) / 2;
    const paddleW = 76;
    const paddleH = 10;
    let ballX = W / 2;
    let ballY = H - 30;
    let dx = 3;
    let dy = -3;
    let currentScore = 0;
    let rightPressed = false;
    let leftPressed = false;
    let rafId = 0;
    let ended = false;

    const rows = 4;
    const cols = 7;
    const brickW = 44;
    const brickH = 14;
    const pad = 6;
    const offsetLeft = 18;
    const offsetTop = 26;
    const rowColors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

    const bricks: Array<Array<{ x: number; y: number; alive: boolean }>> = [];
    for (let r = 0; r < rows; r++) {
      bricks[r] = [];
      for (let c = 0; c < cols; c++) {
        bricks[r][c] = {
          x: offsetLeft + c * (brickW + pad),
          y: offsetTop + r * (brickH + pad),
          alive: true,
        };
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * W;
      paddleX = Math.max(0, Math.min(W - paddleW, relX - paddleW / 2));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      if (ended) return;
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);

      let remaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const b = bricks[r][c];
          if (!b.alive) continue;
          remaining++;
          ctx.fillStyle = rowColors[r % rowColors.length];
          ctx.fillRect(b.x, b.y, brickW, brickH);

          if (
            ballX > b.x &&
            ballX < b.x + brickW &&
            ballY > b.y &&
            ballY < b.y + brickH
          ) {
            dy = -dy;
            b.alive = false;
            currentScore += 10;
            setScore(currentScore);
          }
        }
      }

      if (remaining === 0) {
        ended = true;
        setGameOver(true);
        onSubmitScore('breakout', currentScore);
        return;
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f4f4f5';
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.fillStyle = '#10b981';
      ctx.fillRect(paddleX, H - paddleH - 8, paddleW, paddleH);

      if (ballX + dx > W - 6 || ballX + dx < 6) dx = -dx;
      if (ballY + dy < 6) {
        dy = -dy;
      } else if (ballY + dy > H - paddleH - 12) {
        if (ballX > paddleX && ballX < paddleX + paddleW) {
          const hit = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
          dx = hit * 4;
          dy = -Math.abs(dy);
        } else if (ballY + dy > H - 6) {
          ended = true;
          setGameOver(true);
          onSubmitScore('breakout', currentScore);
          return;
        }
      }

      if (rightPressed) paddleX = Math.min(W - paddleW, paddleX + 5);
      if (leftPressed) paddleX = Math.max(0, paddleX - 5);

      ballX += dx;
      ballY += dy;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [runId, onSubmitScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between">
        <div className="text-sm font-mono-num">
          Score: <span className="text-emerald-400 font-bold">{score}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setScore(0);
            setGameOver(false);
            setRunId((n) => n + 1);
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-zinc-800">
        <canvas
          ref={canvasRef}
          width={380}
          height={280}
          className="block max-w-full bg-zinc-950 cursor-pointer"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2">
            <p className="text-lg font-bold text-emerald-400">Round Finished</p>
            <p className="text-xs text-zinc-300 font-mono-num">Score: {score}</p>
            <button
              type="button"
              onClick={() => {
                setScore(0);
                setGameOver(false);
                setRunId((n) => n + 1);
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-500">
        Move paddle with mouse or Left/Right arrow keys.
      </p>
    </div>
  );
};

// ---------------- ARCADE SHELL ----------------
export const GamesArcadeView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId>('snake');
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('calc67_player') || 'Player1'
  );
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const loadScores = useCallback(async (game: GameId) => {
    try {
      const res = await fetch(`/api/scores?game=${game}`);
      const data = (await res.json()) as { scores: ScoreEntry[] };
      setScores(data.scores ?? []);
    } catch {
      setScores([]);
    }
  }, []);

  useEffect(() => {
    loadScores(activeGame);
  }, [activeGame, loadScores]);

  const handleSubmitScore = useCallback(
    async (game: GameId, score: number) => {
      if (score <= 0) return;
      try {
        const res = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ game, player: playerName, score }),
        });
        const data = (await res.json()) as { scores: ScoreEntry[] };
        if (game === activeGame) setScores(data.scores ?? []);
      } catch {
        // Ignore network errors for local offline play
      }
    },
    [playerName, activeGame]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'snake', label: 'Snake' },
                { id: '2048', label: '2048' },
                { id: 'breakout', label: 'Breakout' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGame(g.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeGame === g.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Tag:</span>
            <input
              type="text"
              value={playerName}
              maxLength={16}
              onChange={(e) => {
                setPlayerName(e.target.value);
                localStorage.setItem('calc67_player', e.target.value);
              }}
              className="w-28 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {activeGame === 'snake' && <SnakeGame onSubmitScore={handleSubmitScore} />}
        {activeGame === '2048' && <Game2048 onSubmitScore={handleSubmitScore} />}
        {activeGame === 'breakout' && <BreakoutGame onSubmitScore={handleSubmitScore} />}
      </div>

      <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-400" />
          Leaderboard ({activeGame.toUpperCase()})
        </h3>
        {scores.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">
            No high scores recorded yet. Finish a round to post yours!
          </p>
        ) : (
          <div className="space-y-2">
            {scores.map((entry, idx) => (
              <div
                key={`${entry.player}-${entry.timestamp}-${idx}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono-num text-zinc-500 w-4">#{idx + 1}</span>
                  <span className="text-zinc-200 font-medium">{entry.player}</span>
                </div>
                <span className="font-mono-num font-bold text-emerald-400">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
