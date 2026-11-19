export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculatorError';
  }
}

export function evaluateCalculatorExpression(raw: string): number {
  const normalized = raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  if (!normalized) {
    throw new CalculatorError('Enter an expression');
  }

  let pos = 0;
  const peek = () => normalized[pos] ?? '';
  const consume = () => normalized[pos++];

  function parseExpression(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseUnary();
      if (op === '*') {
        left *= right;
      } else {
        if (right === 0) {
          throw new CalculatorError('Cannot divide by zero');
        }
        left /= right;
      }
    }
    return left;
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
    return parsePostfix();
  }

  function parsePostfix(): number {
    let value = parsePrimary();
    while (peek() === '%') {
      consume();
      value = value / 100;
    }
    return value;
  }

  function parsePrimary(): number {
    if (peek() === '(') {
      consume();
      const inner = parseExpression();
      if (peek() !== ')') {
        throw new CalculatorError('Mismatched parentheses');
      }
      consume();
      return inner;
    }

    const start = pos;
    let hasDigit = false;
    let hasDot = false;

    while (true) {
      const ch = peek();
      if (ch >= '0' && ch <= '9') {
        hasDigit = true;
        consume();
      } else if (ch === '.' && !hasDot) {
        hasDot = true;
        consume();
      } else {
        break;
      }
    }

    if (!hasDigit) {
      throw new CalculatorError('Invalid expression');
    }

    const num = Number(normalized.slice(start, pos));
    if (!Number.isFinite(num)) {
      throw new CalculatorError('Number out of range');
    }
    return num;
  }

  const result = parseExpression();
  if (pos < normalized.length) {
    throw new CalculatorError('Invalid expression');
  }
  if (!Number.isFinite(result)) {
    throw new CalculatorError('Result undefined');
  }
  return result;
}

export function formatCalculatorResult(value: number): string {
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Math.round(value * 1e12) / 1e12;
  if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) < 1e-10 && rounded !== 0)) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return String(rounded);
}
