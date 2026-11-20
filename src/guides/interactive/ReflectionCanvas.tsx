import React, { useState, useEffect, useRef } from 'react';

type SimulationPhase = 'READ_FIRST' | 'ACTIVE' | 'COMPLETE' | 'CLEARED';

export const ReflectionCanvas: React.FC = () => {
  const diagramRef = useRef<HTMLCanvasElement | null>(null);
  const [moduleState, setModuleState] = useState<SimulationPhase>('READ_FIRST');
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [benchmark, setBenchmark] = useState(() =>
    Number(localStorage.getItem('calc_reflection_benchmark') || '0')
  );
  const [phaseCount, setPhaseCount] = useState(1);

  useEffect(() => {
    if (moduleState !== 'ACTIVE') return;
    const canvas = diagramRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const reflectorW = 76;
    const reflectorH = 10;
    let reflectorX = (W - reflectorW) / 2;
    let pointX = W / 2;
    let pointY = H - 30;
    let vx = 3;
    let vy = -3;
    let runningAccuracy = 0;
    let leftPressed = false;
    let rightPressed = false;
    let rafId = 0;
    let halted = false;

    const rows = 4;
    const cols = 7;
    const nodeW = 46;
    const nodeH = 14;
    const spacing = 6;
    const offsetLeft = 22;
    const offsetTop = 26;
    const rowTones = ['#333333', '#555555', '#777777', '#999999'];

    const nodes: Array<Array<{ x: number; y: number; active: boolean }>> = [];
    for (let r = 0; r < rows; r++) {
      nodes[r] = [];
      for (let c = 0; c < cols; c++) {
        nodes[r][c] = {
          x: offsetLeft + c * (nodeW + spacing),
          y: offsetTop + r * (nodeH + spacing),
          active: true,
        };
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
    };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * W;
      reflectorX = Math.max(0, Math.min(W - reflectorW, relX - reflectorW / 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('pointermove', handlePointerMove);

    const moduleCycle = () => {
      if (halted) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      let remaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          if (!node.active) continue;
          remaining++;
          ctx.fillStyle = rowTones[r % rowTones.length];
          ctx.fillRect(node.x, node.y, nodeW, nodeH);

          if (
            pointX > node.x &&
            pointX < node.x + nodeW &&
            pointY > node.y &&
            pointY < node.y + nodeH
          ) {
            vy = -vy;
            node.active = false;
            runningAccuracy += 10;
            setAccuracyRate(runningAccuracy);
            setBenchmark((prevBench) => {
              if (runningAccuracy > prevBench) {
                localStorage.setItem('calc_reflection_benchmark', String(runningAccuracy));
                return runningAccuracy;
              }
              return prevBench;
            });
          }
        }
      }

      if (remaining === 0) {
        halted = true;
        setModuleState('CLEARED');
        return;
      }

      ctx.beginPath();
      ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#333333';
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = '#333333';
      ctx.fillRect(reflectorX, H - reflectorH - 10, reflectorW, reflectorH);

      if (pointX + vx > W - 6 || pointX + vx < 6) vx = -vx;
      if (pointY + vy < 6) {
        vy = -vy;
      } else if (pointY + vy > H - reflectorH - 14) {
        if (pointX > reflectorX && pointX < reflectorX + reflectorW) {
          const ratio = (pointX - (reflectorX + reflectorW / 2)) / (reflectorW / 2);
          vx = ratio * 4;
          vy = -Math.abs(vy);
        } else if (pointY + vy > H - 6) {
          halted = true;
          setModuleState('COMPLETE');
          return;
        }
      }

      if (rightPressed) reflectorX = Math.min(W - reflectorW, reflectorX + 5);
      if (leftPressed) reflectorX = Math.max(0, reflectorX - 5);

      pointX += vx;
      pointY += vy;
      rafId = requestAnimationFrame(moduleCycle);
    };

    rafId = requestAnimationFrame(moduleCycle);
    return () => {
      halted = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [moduleState, phaseCount]);

  const initializeSimulation = () => {
    setAccuracyRate(0);
    setModuleState('ACTIVE');
    setPhaseCount((n) => n + 1);
  };

  return (
    <div
      className="flex flex-col items-center gap-3 bg-white py-2"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <div className="w-full max-w-[400px] border-b border-[#e0e0e0] pb-2 flex items-center justify-between text-xs">
        <div>
          <span className="italic text-[#555555]">Interactive Module 3 · </span>
          <span>Elastic Reflection Diagram</span>
        </div>
        <span>Phase: {phaseCount}</span>
      </div>

      <div className="w-full max-w-[400px] flex items-center justify-between text-xs">
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
          onClick={initializeSimulation}
          className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
        >
          New Phase
        </button>
      </div>

      <div className="relative border border-[#cccccc] bg-white">
        <canvas
          ref={diagramRef}
          width={400}
          height={290}
          className="block max-w-full cursor-pointer touch-none"
        />

        {moduleState === 'READ_FIRST' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#666666]">Read First</p>
            <h3 className="text-base font-normal text-[#333333]">
              Incidence &amp; Reflection Vector Diagram
            </h3>
            <p className="text-xs text-[#4a4a4a] max-w-xs leading-relaxed">
              Position the horizontal reflector segment using pointer motion or Left/Right
              arrow keys to redirect the vector trajectory across upper target nodes.
            </p>
            <button
              type="button"
              onClick={initializeSimulation}
              className="pt-2 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Launch Simulation →
            </button>
          </div>
        )}

        {(moduleState === 'COMPLETE' || moduleState === 'CLEARED') && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-base font-normal text-[#333333]">
              {moduleState === 'CLEARED'
                ? 'All Diagram Nodes Verified'
                : `Phase ${phaseCount} Concluded`}
            </h3>
            <p className="text-xs text-[#4a4a4a]">
              Accuracy Rate: {accuracyRate} · Benchmark: {benchmark}
            </p>
            <button
              type="button"
              onClick={initializeSimulation}
              className="pt-2 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
            >
              Begin Exercise →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
