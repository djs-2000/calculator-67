import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import {
  CalculatorError,
  evaluateCalculatorExpression,
  formatCalculatorResult,
} from './evaluator';

const OPERATORS = new Set(['+', '−', '×', '÷']);

interface CalculatorWidgetProps {
  onSecretSequence?: () => void;
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({
  onSecretSequence,
}) => {
  const [expression, setExpression] = useState('0');
  const [lastExpression, setLastExpression] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleClear = useCallback(() => {
    setExpression('0');
    setLastExpression('');
    setErrorMessage(null);
    setJustEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    if (justEvaluated) {
      setJustEvaluated(false);
    }
    setExpression((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, [justEvaluated]);

  const appendDigitOrDot = useCallback(
    (char: string) => {
      setErrorMessage(null);
      setExpression((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          setLastExpression('');
          return char === '.' ? '0.' : char;
        }
        if (char === '.') {
          // Check current number segment for existing decimal point
          const segments = prev.split(/[+\−×÷()]/);
          const currentSegment = segments[segments.length - 1] ?? '';
          if (currentSegment.includes('.')) return prev;
          if (currentSegment === '') return prev + '0.';
          return prev + '.';
        }
        if (prev === '0') return char;
        if (prev.endsWith(')')) return prev + '×' + char;
        return prev + char;
      });
    },
    [justEvaluated]
  );

  const appendOperator = useCallback(
    (op: string) => {
      setErrorMessage(null);
      setJustEvaluated(false);
      setExpression((prev) => {
        const lastChar = prev[prev.length - 1];
        if (OPERATORS.has(lastChar)) {
          return prev.slice(0, -1) + op;
        }
        if (lastChar === '(' && op !== '−') {
          return prev;
        }
        return prev + op;
      });
    },
    []
  );

  const appendPercent = useCallback(() => {
    setErrorMessage(null);
    setJustEvaluated(false);
    setExpression((prev) => {
      const lastChar = prev[prev.length - 1];
      if (!lastChar || OPERATORS.has(lastChar) || lastChar === '(' || lastChar === '%') {
        return prev;
      }
      return prev + '%';
    });
  }, []);

  const toggleSign = useCallback(() => {
    setErrorMessage(null);
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev === '0') return '−';
      if (prev === '−') return '0';
      // Toggle sign on the trailing number segment
      const match = prev.match(/^(.*?)(\(−\d*\.?\d*\)|\d+\.?\d*)$/);
      if (!match) return prev;
      const prefix = match[1];
      const token = match[2];
      if (token.startsWith('(−') && token.endsWith(')')) {
        return prefix + token.slice(2, -1);
      }
      if (prefix === '' && !prev.startsWith('−')) {
        return '−' + token;
      }
      if (prefix === '−') {
        return token;
      }
      return `${prefix}(−${token})`;
    });
  }, []);

  const appendParenthesis = useCallback(
    (paren: '(' | ')') => {
      setErrorMessage(null);
      setExpression((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          setLastExpression('');
          return paren === '(' ? '(' : prev;
        }
        if (paren === '(') {
          if (prev === '0') return '(';
          const last = prev[prev.length - 1];
          if ((last >= '0' && last <= '9') || last === ')' || last === '%') {
            return prev + '×(';
          }
          return prev + '(';
        }
        const openCount = (prev.match(/\(/g) ?? []).length;
        const closeCount = (prev.match(/\)/g) ?? []).length;
        if (openCount <= closeCount) return prev;
        const last = prev[prev.length - 1];
        if (OPERATORS.has(last) || last === '(') return prev;
        return prev + ')';
      });
    },
    [justEvaluated]
  );

  const handleEvaluate = useCallback(() => {
    if (expression.trim() === '1234' && onSecretSequence) {
      setExpression('0');
      setLastExpression('');
      setErrorMessage(null);
      setJustEvaluated(false);
      onSecretSequence();
      return;
    }

    try {
      const result = evaluateCalculatorExpression(expression);
      const formatted = formatCalculatorResult(result);
      setLastExpression(expression);
      setExpression(formatted);
      setErrorMessage(null);
      setJustEvaluated(true);
    } catch (err) {
      if (err instanceof CalculatorError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Invalid expression');
      }
    }
  }, [expression, onSecretSequence]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        appendDigitOrDot(e.key);
      } else if (e.key === '.') {
        appendDigitOrDot('.');
      } else if (e.key === '+') {
        appendOperator('+');
      } else if (e.key === '-') {
        appendOperator('−');
      } else if (e.key === '*') {
        appendOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('÷');
      } else if (e.key === '%') {
        appendPercent();
      } else if (e.key === '(' || e.key === ')') {
        appendParenthesis(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    appendDigitOrDot,
    appendOperator,
    appendParenthesis,
    appendPercent,
    handleBackspace,
    handleClear,
    handleEvaluate,
  ]);

  const buttons: Array<{
    label: string;
    ariaLabel: string;
    onClick: () => void;
    tone: 'utility' | 'number' | 'operator' | 'equals';
  }> = [
    { label: 'AC', ariaLabel: 'All Clear', onClick: handleClear, tone: 'utility' },
    { label: '( )', ariaLabel: 'Parentheses', onClick: () => {
      const openCount = (expression.match(/\(/g) ?? []).length;
      const closeCount = (expression.match(/\)/g) ?? []).length;
      const last = expression[expression.length - 1];
      if (openCount > closeCount && !OPERATORS.has(last) && last !== '(') {
        appendParenthesis(')');
      } else {
        appendParenthesis('(');
      }
    }, tone: 'utility' },
    { label: '%', ariaLabel: 'Percent', onClick: appendPercent, tone: 'utility' },
    { label: '÷', ariaLabel: 'Divide', onClick: () => appendOperator('÷'), tone: 'operator' },

    { label: '7', ariaLabel: '7', onClick: () => appendDigitOrDot('7'), tone: 'number' },
    { label: '8', ariaLabel: '8', onClick: () => appendDigitOrDot('8'), tone: 'number' },
    { label: '9', ariaLabel: '9', onClick: () => appendDigitOrDot('9'), tone: 'number' },
    { label: '×', ariaLabel: 'Multiply', onClick: () => appendOperator('×'), tone: 'operator' },

    { label: '4', ariaLabel: '4', onClick: () => appendDigitOrDot('4'), tone: 'number' },
    { label: '5', ariaLabel: '5', onClick: () => appendDigitOrDot('5'), tone: 'number' },
    { label: '6', ariaLabel: '6', onClick: () => appendDigitOrDot('6'), tone: 'number' },
    { label: '−', ariaLabel: 'Subtract', onClick: () => appendOperator('−'), tone: 'operator' },

    { label: '1', ariaLabel: '1', onClick: () => appendDigitOrDot('1'), tone: 'number' },
    { label: '2', ariaLabel: '2', onClick: () => appendDigitOrDot('2'), tone: 'number' },
    { label: '3', ariaLabel: '3', onClick: () => appendDigitOrDot('3'), tone: 'number' },
    { label: '+', ariaLabel: 'Add', onClick: () => appendOperator('+'), tone: 'operator' },

    { label: '+/−', ariaLabel: 'Toggle Sign', onClick: toggleSign, tone: 'number' },
    { label: '0', ariaLabel: '0', onClick: () => appendDigitOrDot('0'), tone: 'number' },
    { label: '.', ariaLabel: 'Decimal Point', onClick: () => appendDigitOrDot('.'), tone: 'number' },
    { label: '=', ariaLabel: 'Equals', onClick: handleEvaluate, tone: 'equals' },
  ];

  return (
    <div className="w-full max-w-[380px] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Display */}
      <div className="px-5 pt-5 pb-4 bg-slate-50/70 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 min-h-[22px]">
          <span
            className={`text-xs font-mono-num truncate ${
              errorMessage ? 'text-red-600 font-medium' : 'text-slate-500'
            }`}
            aria-live="polite"
          >
            {errorMessage ?? (lastExpression ? `${lastExpression} =` : '\u00A0')}
          </span>
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Backspace"
            title="Backspace"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        <div
          className="mt-2 text-right font-mono-num text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight break-all min-h-[44px] flex items-center justify-end"
          data-testid="calculator-display"
        >
          {expression}
        </div>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-4 gap-2.5">
        {buttons.map((btn) => {
          const toneClasses =
            btn.tone === 'equals'
              ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900 font-semibold'
              : btn.tone === 'operator'
                ? 'bg-slate-100 text-slate-900 hover:bg-slate-200/80 border-slate-200 font-semibold'
                : btn.tone === 'utility'
                  ? 'bg-slate-100/70 text-slate-700 hover:bg-slate-200/70 border-slate-200 font-medium'
                  : 'bg-white text-slate-900 hover:bg-slate-50 border-slate-200 font-medium';

          return (
            <button
              key={btn.ariaLabel}
              type="button"
              aria-label={btn.ariaLabel}
              onClick={btn.onClick}
              className={`h-13 sm:h-14 rounded-lg border text-lg font-mono-num flex items-center justify-center transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${toneClasses}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
