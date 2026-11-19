import React, { useState, useEffect, useCallback } from 'react';
import { Delete, History, Sparkles, RotateCcw } from 'lucide-react';

interface CalculatorViewProps {
  onUnlockHub: () => void;
  hubUnlocked: boolean;
}

interface HistoryItem {
  expression: string;
  result: string;
}

function evaluateExpression(raw: string): number {
  const sanitized = raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, String(Math.PI))
    .replace(/\be\b/g, String(Math.E))
    .replace(/\s+/g, '');

  if (!sanitized) throw new Error('Empty');

  let pos = 0;

  const peek = () => sanitized[pos] ?? '';
  const consume = () => sanitized[pos++];

  function parseExpression(): number {
    let val = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      val = op === '+' ? val + right : val - right;
    }
    return val;
  }

  function parseTerm(): number {
    let val = parsePower();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = consume();
      const right = parsePower();
      if (op === '*') val *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Divide by zero');
        val /= right;
      } else {
        val %= right;
      }
    }
    return val;
  }

  function parsePower(): number {
    const base = parseUnary();
    if (peek() === '^') {
      consume();
      const exp = parsePower();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary(): number {
    if (peek() === '-') {
      consume();
      return -parseUnary();
    }
    if (peek() === '+') {
      consume();
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    if (peek() === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') consume();
      return val;
    }

    // Named functions
    const funcs = ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'abs'] as const;
    for (const fn of funcs) {
      if (sanitized.startsWith(fn + '(', pos)) {
        pos += fn.length;
        const arg = parsePrimary();
        switch (fn) {
          case 'sqrt':
            if (arg < 0) throw new Error('Invalid sqrt');
            return Math.sqrt(arg);
          case 'sin':
            return Math.sin((arg * Math.PI) / 180);
          case 'cos':
            return Math.cos((arg * Math.PI) / 180);
          case 'tan':
            return Math.tan((arg * Math.PI) / 180);
          case 'log':
            if (arg <= 0) throw new Error('Invalid log');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('Invalid ln');
            return Math.log(arg);
          case 'abs':
            return Math.abs(arg);
        }
      }
    }

    // Number literal
    const start = pos;
    let seenDot = false;
    while (
      (peek() >= '0' && peek() <= '9') ||
      (peek() === '.' && !seenDot)
    ) {
      if (peek() === '.') seenDot = true;
      consume();
    }
    if (pos === start) throw new Error('Unexpected token');
    const num = Number(sanitized.slice(start, pos));
    if (!Number.isFinite(num)) throw new Error('Invalid number');
    return num;
  }

  const result = parseExpression();
  if (pos < sanitized.length) throw new Error('Trailing characters');
  if (!Number.isFinite(result)) throw new Error('Math error');
  return result;
}

function formatNumber(n: number): string {
  if (Object.is(n, -0)) return '0';
  const rounded = Math.round(n * 1e10) / 1e10;
  return String(rounded);
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  onUnlockHub,
  hubUnlocked,
}) => {
  const [expression, setExpression] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scientific, setScientific] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { expression: '12 × 5 + 7', result: '67' },
    { expression: 'sqrt(144)', result: '12' },
  ]);

  const appendToken = useCallback(
    (token: string) => {
      setError(null);
      const isOperator = ['+', '−', '×', '÷', '^', '%'].includes(token);
      setExpression((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          if (isOperator) return prev + token;
          return token === '.' ? '0.' : token;
        }
        if (prev === '0' && !isOperator && token !== '.' && token !== ')') {
          return token;
        }
        return prev + token;
      });
    },
    [justEvaluated]
  );

  const handleClear = useCallback(() => {
    setExpression('0');
    setError(null);
    setJustEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    setJustEvaluated(false);
    setExpression((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  }, []);

  const handleEvaluate = useCallback(() => {
    const trimmed = expression.trim();
    if (trimmed === '67') {
      setHistory((prev) => [
        { expression: '67', result: 'Unlocked' },
        ...prev.slice(0, 14),
      ]);
      onUnlockHub();
      return;
    }

    try {
      const value = evaluateExpression(trimmed);
      const formatted = formatNumber(value);
      setHistory((prev) => [
        { expression: trimmed, result: formatted },
        ...prev.slice(0, 14),
      ]);
      setExpression(formatted);
      setJustEvaluated(true);
      setError(null);
    } catch {
      setError('Syntax Error');
    }
  }, [expression, onUnlockHub]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        appendToken(e.key);
      } else if (e.key === '.') {
        appendToken('.');
      } else if (e.key === '+') {
        appendToken('+');
      } else if (e.key === '-') {
        appendToken('−');
      } else if (e.key === '*') {
        appendToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (e.key === '(' || e.key === ')') {
        appendToken(e.key);
      } else if (e.key === '^') {
        appendToken('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendToken, handleBackspace, handleClear, handleEvaluate]);

  const basicButtons = [
    { label: 'C', action: handleClear, variant: 'muted' },
    { label: '(', action: () => appendToken('('), variant: 'muted' },
    { label: ')', action: () => appendToken(')'), variant: 'muted' },
    { label: '÷', action: () => appendToken('÷'), variant: 'op' },
    { label: '7', action: () => appendToken('7'), variant: 'num' },
    { label: '8', action: () => appendToken('8'), variant: 'num' },
    { label: '9', action: () => appendToken('9'), variant: 'num' },
    { label: '×', action: () => appendToken('×'), variant: 'op' },
    { label: '4', action: () => appendToken('4'), variant: 'num' },
    { label: '5', action: () => appendToken('5'), variant: 'num' },
    { label: '6', action: () => appendToken('6'), variant: 'num' },
    { label: '−', action: () => appendToken('−'), variant: 'op' },
    { label: '1', action: () => appendToken('1'), variant: 'num' },
    { label: '2', action: () => appendToken('2'), variant: 'num' },
    { label: '3', action: () => appendToken('3'), variant: 'num' },
    { label: '+', action: () => appendToken('+'), variant: 'op' },
    { label: '0', action: () => appendToken('0'), variant: 'num' },
    { label: '.', action: () => appendToken('.'), variant: 'num' },
    { label: 'DEL', action: handleBackspace, variant: 'num' },
    { label: '=', action: handleEvaluate, variant: 'eq' },
  ];

  const sciButtons = [
    { label: 'sin', token: 'sin(' },
    { label: 'cos', token: 'cos(' },
    { label: 'tan', token: 'tan(' },
    { label: '√', token: 'sqrt(' },
    { label: 'log', token: 'log(' },
    { label: 'ln', token: 'ln(' },
    { label: 'π', token: 'π' },
    { label: 'xʸ', token: '^' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Calculator Body */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/90">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold tracking-tight text-zinc-200">
                Calculator 67
              </span>
              <span className="text-xs text-zinc-500 font-mono-num">v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScientific((s) => !s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  scientific
                    ? 'bg-zinc-700 text-zinc-100'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sci
              </button>
              <button
                type="button"
                onClick={onUnlockHub}
                title="Open Extra Features (or type 67 =)"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 hover:bg-emerald-500/15 hover:text-emerald-300 border border-zinc-700/70 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {hubUnlocked ? 'Hub' : 'fx-67'}
              </button>
            </div>
          </div>

          {/* Display */}
          <div className="px-6 py-6 bg-zinc-950/70 border-b border-zinc-800/80 text-right">
            <div className="h-5 text-xs font-mono-num text-rose-400">
              {error ?? (justEvaluated ? 'ANS' : '')}
            </div>
            <div className="mt-1 text-3xl sm:text-4xl font-semibold font-mono-num text-zinc-50 break-all min-h-[2.75rem] flex items-center justify-end">
              {expression}
            </div>
          </div>

          {/* Scientific Row */}
          {scientific && (
            <div className="grid grid-cols-4 gap-2 px-5 pt-4">
              {sciButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => appendToken(btn.token)}
                  className="py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-mono-num font-medium border border-zinc-700/50 transition active:scale-[0.98]"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Keypad */}
          <div className="p-5 grid grid-cols-4 gap-2.5">
            {basicButtons.map((btn) => {
              const style =
                btn.variant === 'eq'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold'
                  : btn.variant === 'op'
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-semibold border border-zinc-700/60'
                    : btn.variant === 'muted'
                      ? 'bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 border border-zinc-800'
                      : 'bg-zinc-850 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/80';
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className={`h-14 rounded-xl text-lg font-mono-num flex items-center justify-center transition active:scale-[0.97] ${style}`}
                >
                  {btn.label === 'DEL' ? <Delete className="w-5 h-5" /> : btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* History & Hint Panel */}
        <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <History className="w-4 h-4 text-zinc-400" />
              Tape History
            </div>
            <button
              type="button"
              onClick={() => setHistory([])}
              className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                No calculations yet.
              </p>
            ) : (
              history.map((item, idx) => (
                <button
                  key={`${item.expression}-${idx}`}
                  type="button"
                  onClick={() => {
                    if (item.result !== 'Unlocked') {
                      setExpression(item.result);
                      setJustEvaluated(true);
                    }
                  }}
                  className="w-full text-right px-3.5 py-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/70 border border-zinc-800/70 transition flex items-center justify-between gap-3"
                >
                  <span className="text-xs font-mono-num text-zinc-400 truncate">
                    {item.expression}
                  </span>
                  <span className="text-sm font-mono-num font-semibold text-emerald-400 shrink-0">
                    = {item.result}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
            Tip: Enter <span className="font-mono-num text-emerald-400 font-semibold">67</span>{' '}
            and press <span className="font-mono-num text-zinc-200">=</span> (or click{' '}
            <span className="text-zinc-200 font-medium">fx-67</span>) to access extra features.
          </div>
        </div>
      </div>
    </div>
  );
};
