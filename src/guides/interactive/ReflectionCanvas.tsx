import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play } from 'lucide-react';

type SimState = 'READY' | 'RUNNING' | 'COMPLETE' | 'CLEARED';

export const ReflectionCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simState, setSimState] = useState<SimState>('READY');
  const [points, setPoints] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (simState !== 'RUNNING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const barW = 76;
    const barH = 10;
    let barX = (W - barW) / 2;
    let orbX = W / 2;
    let orbY = H - 30;
    let dx = 3;
    let dy = -3;
    let currentPoints = 0;
    let leftPressed = false;
    let rightPressed = false;
    let rafId = 0;
    let stopped = false;

    const rows = 4;
    const cols = 7;
    const targetW = 46;
    const targetH = 14;
    const pad = 6;
    const offsetLeft = 22;
    const offsetTop = 26;
    const rowColors = ['#DC2626', '#D97706', '#2563EB', '#059669'];

    const targets: Array<Array<{ x: number; y: number; active: boolean }>> = [];
    for (let r = 0; r < rows; r++) {
      targets[r] = [];
      for (let c = 0; c < cols; c++) {
        targets[r][c] = {
          x: offsetLeft + c * (targetW + pad),
          y: offsetTop + r * (targetH + pad),
          active: true,
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
      barX = Math.max(0, Math.min(W - barW, relX - barW / 2));
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
          const b = targets[r][c];
          if (!b.active) continue;
          remaining++;
          ctx.fillStyle = rowColors[r % rowColors.length];
          ctx.fillRect(b.x, b.y, targetW, targetH);

          if (orbX > b.x && orbX < b.x + targetW && orbY > b.y && orbY < b.y + targetH) {
            dy = -dy;
            b.active = false;
            currentPoints += 10;
            setPoints(currentPoints);
          }
        }
      }

      if (remaining === 0) {
        stopped = true;
        setSimState('CLEARED');
        return;
      }

      ctx.beginPath();
      ctx.arc(orbX, orbY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(barX, H - barH - 10, barW, barH);

      if (orbX + dx > W - 6 || orbX + dx < 6) dx = -dx;
      if (orbY + dy < 6) {
        dy = -dy;
      } else if (orbY + dy > H - barH - 14) {
        if (orbX > barX && orbX < barX + barW) {
          const hit = (orbX - (barX + barW / 2)) / (barW / 2);
          dx = hit * 4;
          dy = -Math.abs(dy);
        } else if (orbY + dy > H - 6) {
          stopped = true;
          setSimState('COMPLETE');
          return;
        }
      }

      if (rightPressed) barX = Math.min(W - barW, barX + 5);
      if (leftPressed) barX = Math.max(0, barX - 5);

      orbX += dx;
      orbY += dy;
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
  }, [simState, runId]);

  const start = () => {
    setPoints(0);
    setSimState('RUNNING');
    setRunId((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[400px] flex items-center justify-between">
        <div className="text-sm font-mono-num text-slate-700">
          Points: <strong className="text-slate-900">{points}</strong>
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

        {simState === 'READY' && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Elastic Reflection Guide
            </h3>
            <p className="mt-1 text-xs text-slate-600 max-w-xs">
              Observe reflection angles by moving the reflector bar with your pointer,
              touch, or Left/Right arrow keys.
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Start Walkthrough
            </button>
          </div>
        )}

        {(simState === 'COMPLETE' || simState === 'CLEARED') && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {simState === 'CLEARED' ? 'All Targets Cleared' : 'Trial Complete'}
            </h3>
            <p className="mt-1 text-sm font-mono-num text-slate-600">Points: {points}</p>
            <button
              type="button"
              onClick={start}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Restart Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
