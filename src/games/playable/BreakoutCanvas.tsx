import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'GAME_OVER' | 'VICTORY';

export const BreakoutCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [score, setScore] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const paddleW = 76;
    const paddleH = 10;
    let paddleX = (W - paddleW) / 2;
    let ballX = W / 2;
    let ballY = H - 30;
    let dx = 3;
    let dy = -3;
    let currentScore = 0;
    let leftPressed = false;
    let rightPressed = false;
    let rafId = 0;
    let stopped = false;

    const rows = 4;
    const cols = 7;
    const brickW = 46;
    const brickH = 14;
    const pad = 6;
    const offsetLeft = 22;
    const offsetTop = 26;
    const rowColors = ['#DC2626', '#D97706', '#2563EB', '#059669'];

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
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * W;
      paddleX = Math.max(0, Math.min(W - paddleW, relX - paddleW / 2));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const frame = () => {
      if (stopped) return;
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, W, H);

      let remaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const b = bricks[r][c];
          if (!b.alive) continue;
          remaining++;
          ctx.fillStyle = rowColors[r % rowColors.length];
          ctx.fillRect(b.x, b.y, brickW, brickH);

          if (ballX > b.x && ballX < b.x + brickW && ballY > b.y && ballY < b.y + brickH) {
            dy = -dy;
            b.alive = false;
            currentScore += 10;
            setScore(currentScore);
          }
        }
      }

      if (remaining === 0) {
        stopped = true;
        setGameState('VICTORY');
        return;
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(paddleX, H - paddleH - 10, paddleW, paddleH);

      if (ballX + dx > W - 6 || ballX + dx < 6) dx = -dx;
      if (ballY + dy < 6) {
        dy = -dy;
      } else if (ballY + dy > H - paddleH - 14) {
        if (ballX > paddleX && ballX < paddleX + paddleW) {
          const hit = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
          dx = hit * 4;
          dy = -Math.abs(dy);
        } else if (ballY + dy > H - 6) {
          stopped = true;
          setGameState('GAME_OVER');
          return;
        }
      }

      if (rightPressed) paddleX = Math.min(W - paddleW, paddleX + 5);
      if (leftPressed) paddleX = Math.max(0, paddleX - 5);

      ballX += dx;
      ballY += dy;
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, [gameState, runId]);

  const start = () => {
    setScore(0);
    setGameState('PLAYING');
    setRunId((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[400px] flex items-center justify-between">
        <div className="text-sm font-mono-num text-slate-700">
          Score: <strong className="text-slate-900">{score}</strong>
        </div>
        <button
          type="button"
          onClick={start}
          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={290}
          className="block max-w-full cursor-pointer touch-none"
        />

        {gameState === 'TITLE_MENU' && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Block Breaker</h3>
            <p className="mt-1 text-xs text-slate-600 max-w-xs">
              Move the paddle with your mouse, touch, or Left/Right arrow keys.
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Start Game
            </button>
          </div>
        )}

        {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {gameState === 'VICTORY' ? 'Board Cleared' : 'Game Over'}
            </h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">Score: {score}</p>
            <button
              type="button"
              onClick={start}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
