import { type MathCourse } from '../types';

export const algebra2Course: MathCourse = {
  slug: 'algebra-2',
  title: 'Algebra 2',
  level: 'Advanced Algebra · Grade 11',
  summary:
    'Complex numbers, polynomial division and roots, rational asymptotes, radical equations, logarithms, conic sections, sequences, and combinatorics.',
  pages: [
    {
      pageNumber: 1,
      slug: 'quadratic-functions-complex-numbers',
      title: 'Vertex Form & Complex Numbers',
      summary:
        'Transform quadratics into vertex form by completing the square, operate with imaginary and complex numbers a + bi, and solve equations with complex roots.',
      objectives: [
        'Simplify powers of i and perform arithmetic with complex numbers.',
        'Rationalize complex denominators using complex conjugates.',
        'Convert between standard form and vertex form of a parabola.',
      ],
      formulas: [
        {
          label: 'Imaginary Unit Powers',
          expression: 'i = √(−1),  i² = −1,  i³ = −i,  i⁴ = 1',
        },
        {
          label: 'Complex Conjugate Product',
          expression: '(a + bi)(a − bi) = a² + b²',
        },
        {
          label: 'Vertex Form',
          expression: 'f(x) = a(x − h)² + k   (Vertex at (h, k))',
        },
      ],
      concepts: [
        'Complex roots of polynomials with real coefficients always appear in conjugate pairs (a + bi and a − bi).',
        'To reduce i^n, divide n by 4 and match the remainder (0 → 1, 1 → i, 2 → −1, 3 → −i).',
        'When Δ = b² − 4ac < 0, the quadratic has two complex conjugate solutions.',
      ],
      example: {
        prompt: 'Express (3 + 2i) / (1 − i) in standard form a + bi.',
        steps: [
          'Multiply numerator and denominator by the conjugate (1 + i).',
          'Numerator: (3 + 2i)(1 + i) = 3 + 3i + 2i + 2i² = 3 + 5i − 2 = 1 + 5i.',
          'Denominator: (1 − i)(1 + i) = 1² + 1² = 2.',
          'Split real and imaginary parts: (1/2) + (5/2)i.',
        ],
        answer: '0.5 + 2.5i',
      },
      practice: [
        {
          question: 'Simplify i²³.',
          options: ['1', '−1', 'i', '−i'],
          correctIndex: 3,
          explanation: '23 ÷ 4 leaves remainder 3, and i³ = −i.',
        },
        {
          question: 'Solve x² + 4x + 13 = 0.',
          options: ['−2 ± 3i', '2 ± 3i', '−2 ± 9i', '−4 ± 6i'],
          correctIndex: 0,
          explanation: 'x = (−4 ± √(16 − 52)) / 2 = (−4 ± √(−36)) / 2 = (−4 ± 6i)/2 = −2 ± 3i.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'polynomial-functions-end-behavior',
      title: 'Polynomial End Behavior, Zeros & Multiplicity',
      summary:
        'Predict long-run graph behavior from leading terms, determine how multiplicity affects x-intercept behavior, and factor higher-degree polynomials.',
      objectives: [
        'Describe end behavior using degree parity and leading coefficient sign.',
        'Predict whether a graph crosses or touches/turns at a zero based on multiplicity.',
        'Factor sum and difference of cubes.',
      ],
      formulas: [
        {
          label: 'Sum & Difference of Cubes',
          expression: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
        },
        {
          label: 'Multiplicity Behavior',
          expression: 'Odd multiplicity: crosses x-axis  |  Even multiplicity: touches & turns',
        },
      ],
      concepts: [
        'Even-degree polynomials have ends pointing in the same direction (both up if a_n > 0, both down if a_n < 0).',
        'Odd-degree polynomials have ends pointing in opposite directions.',
        'A polynomial of degree n has at most n − 1 local turning points and exactly n complex roots counted with multiplicity.',
      ],
      example: {
        prompt: 'Describe the zeros, multiplicities, and end behavior of f(x) = −2x(x − 3)²(x + 1).',
        steps: [
          'Expand leading term: −2x · x² · x = −2x⁴ (degree 4, negative leading coefficient).',
          'End behavior: as x → ±∞, f(x) → −∞ (both ends fall).',
          'Zeros: x = 0 (mult. 1, crosses), x = 3 (mult. 2, touches/turns), x = −1 (mult. 1, crosses).',
        ],
        answer: 'Both ends → −∞; crosses at −1 and 0, turns at 3',
      },
      practice: [
        {
          question: 'Factor x³ − 27 completely over the integers.',
          options: ['(x − 3)(x² + 3x + 9)', '(x − 3)(x² − 3x + 9)', '(x − 3)³', '(x + 3)(x² − 3x + 9)'],
          correctIndex: 0,
          explanation: 'Difference of cubes: a³ − b³ = (a − b)(a² + ab + b²) with a = x, b = 3.',
        },
        {
          question: 'Which statement describes f(x) = 4x⁵ − 9x² + 1 as x → −∞?',
          options: ['f(x) → +∞', 'f(x) → −∞', 'f(x) → 0', 'f(x) → 4'],
          correctIndex: 1,
          explanation: 'Leading term 4x⁵ has odd degree and positive coefficient, so as x → −∞, 4x⁵ → −∞.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'polynomial-division-roots',
      title: 'Synthetic Division & Rational Root Theorem',
      summary:
        'Divide polynomials using long and synthetic division, apply the Remainder and Factor Theorems, and list possible rational zeros.',
      objectives: [
        'Use synthetic division when dividing by (x − k).',
        'Evaluate P(k) using the Remainder Theorem.',
        'Find all real and complex roots using the Rational Root Theorem.',
      ],
      formulas: [
        {
          label: 'Remainder Theorem',
          expression: 'Remainder when P(x) is divided by (x − k) equals P(k)',
        },
        {
          label: 'Rational Root Theorem',
          expression: 'Possible rational roots = ±(factors of constant a₀) / (factors of leading a_n)',
        },
      ],
      concepts: [
        'Always insert a 0 placeholder coefficient for any missing degree term before setting up synthetic division.',
        'If the remainder is 0, then (x − k) is a factor and k is a root of P(x).',
        'Once synthetic division reduces a cubic to a quadratic factor, solve the quadratic directly.',
      ],
      example: {
        prompt: 'Use synthetic division to divide P(x) = x³ − 6x + 4 by (x − 2).',
        steps: [
          'Write coefficients with 0 for the missing x² term: 1, 0, −6, 4 and root k = 2.',
          'Bring down 1; multiply by 2 → 2; add to 0 → 2.',
          'Multiply 2 by 2 → 4; add to −6 → −2.',
          'Multiply −2 by 2 → −4; add to 4 → 0 (remainder 0).',
        ],
        answer: 'Quotient x² + 2x − 2, Remainder 0',
      },
      practice: [
        {
          question: 'Which is NOT a possible rational root of 2x³ − 5x + 3 = 0?',
          options: ['1/2', '3/2', '2/3', '−3'],
          correctIndex: 2,
          explanation: 'Factors of constant 3 are ±1, ±3; factors of leading 2 are ±1, ±2. Thus 2/3 is impossible.',
        },
        {
          question: 'If P(x) = x³ + 2x² − 5x + 1, what is the remainder when divided by (x − 1)?',
          options: ['−1', '1', '0', '9'],
          correctIndex: 0,
          explanation: 'By the Remainder Theorem, remainder = P(1) = 1 + 2 − 5 + 1 = −1.',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'rational-functions-asymptotes',
      title: 'Rational Functions, Asymptotes & Equations',
      summary:
        'Identify domain restrictions, removable holes, vertical and horizontal asymptotes, and solve rational equations while checking for extraneous roots.',
      objectives: [
        'Factor numerator and denominator to locate holes vs. vertical asymptotes.',
        'Determine horizontal asymptotes by comparing degrees of numerator and denominator.',
        'Clear denominators cleanly when solving rational equations.',
      ],
      formulas: [
        {
          label: 'Horizontal Asymptotes of P(x)/Q(x)',
          expression: 'deg P < deg Q: y = 0  |  deg P = deg Q: y = a_n / b_m  |  deg P > deg Q: none',
        },
        {
          label: 'Holes vs. Vertical Asymptotes',
          expression: 'Canceled factor (x−c): hole at x=c  |  Remaining denom factor: VA at x=c',
        },
      ],
      concepts: [
        'Any x-value that makes an original denominator zero is excluded from the domain, even if that factor cancels.',
        'A graph can cross a horizontal asymptote in the middle, whereas it never crosses a vertical asymptote.',
        'Always verify solutions to rational equations against restricted values to discard extraneous answers.',
      ],
      example: {
        prompt: 'Find holes and asymptotes of f(x) = (x² − 9) / (x² − x − 6).',
        steps: [
          'Factor numerator and denominator: (x − 3)(x + 3) / ((x − 3)(x + 2)).',
          'Cancel common factor (x − 3): hole occurs at x = 3 (with y = (3+3)/(3+2) = 6/5).',
          'Remaining denominator x + 2 = 0 gives vertical asymptote x = −2.',
          'Degrees are equal (both 2), so horizontal asymptote is y = 1/1 = 1.',
        ],
        answer: 'Hole at (3, 1.2); VA: x = −2; HA: y = 1',
      },
      practice: [
        {
          question: 'What is the horizontal asymptote of f(x) = (6x² − 1) / (2x² + 5x)?',
          options: ['y = 0', 'y = 3', 'y = −1/5', 'None'],
          correctIndex: 1,
          explanation: 'Numerator and denominator both have degree 2, so the HA is the ratio of leading coefficients: 6/2 = 3.',
        },
        {
          question: 'Solve 2/(x − 1) + 1 = 2x/(x − 1).',
          options: ['x = 1', 'x = −1', 'No solution', 'x = 2'],
          correctIndex: 2,
          explanation: 'Multiplying by (x − 1) yields 2 + (x − 1) = 2x ⇒ x + 1 = 2x ⇒ x = 1, which makes denominator zero (extraneous), so no solution.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'radical-rational-exponents',
      title: 'Rational Exponents, Radical Equations & Inverses',
      summary:
        'Convert between radical notation and fractional exponents, solve equations containing roots, and find inverse functions algebraically.',
      objectives: [
        'Rewrite n-th roots using fractional exponents a^(m/n).',
        'Isolate radicals before raising both sides to a power and check for extraneous solutions.',
        'Find f⁻¹(x) by swapping x and y and restricting domains if needed.',
      ],
      formulas: [
        {
          label: 'Rational Exponent Definition',
          expression: 'a^(m/n) = (ⁿ√a)^m = ⁿ√(a^m)',
        },
        {
          label: 'Inverse Function Property',
          expression: 'f(f⁻¹(x)) = x   and   f⁻¹(f(x)) = x',
          note: 'Graphs reflect across the line y = x.',
        },
      ],
      concepts: [
        'Even-index roots require non-negative radicands in the real number system; odd-index roots accept all real numbers.',
        'Squaring both sides of an equation is non-reversible and can introduce false roots; always verify in the original equation.',
        'A function has an inverse that is also a function if and only if it passes the Horizontal Line Test (one-to-one).',
      ],
      example: {
        prompt: 'Solve √(2x + 7) = x + 2.',
        steps: [
          'Square both sides: 2x + 7 = (x + 2)² = x² + 4x + 4.',
          'Rearrange to zero: x² + 2x − 3 = 0.',
          'Factor: (x + 3)(x − 1) = 0 ⇒ x = −3 or x = 1.',
          'Check x = −3: √(1) = 1 ≠ −1 (extraneous). Check x = 1: √(9) = 3 = 1 + 2 (valid).',
        ],
        answer: 'x = 1',
      },
      practice: [
        {
          question: 'Evaluate 27^(−2/3).',
          options: ['−9', '1/9', '9', '1/18'],
          correctIndex: 1,
          explanation: '27^(1/3) = 3, then 3⁻² = 1/3² = 1/9.',
        },
        {
          question: 'Find the inverse of f(x) = 3x − 5.',
          options: ['f⁻¹(x) = (x + 5)/3', 'f⁻¹(x) = (x − 5)/3', 'f⁻¹(x) = 1/(3x − 5)', 'f⁻¹(x) = 5x − 3'],
          correctIndex: 0,
          explanation: 'Swap x and y: x = 3y − 5 ⇒ 3y = x + 5 ⇒ y = (x + 5)/3.',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'exponential-logarithmic-functions',
      title: 'Exponential Models, e & Logarithms',
      summary:
        'Connect exponential and logarithmic forms as inverses, evaluate common and natural logs, and solve compound interest problems.',
      objectives: [
        'Convert fluently between b^y = x and log_b(x) = y.',
        'Apply discrete and continuous compound interest formulas.',
        'Identify asymptotes and domains of exponential and logarithmic graphs.',
      ],
      formulas: [
        {
          label: 'Logarithm Equivalence',
          expression: 'log_b(x) = y  ⇔  b^y = x   (b > 0, b ≠ 1, x > 0)',
        },
        {
          label: 'Compound Interest',
          expression: 'A = P(1 + r/n)^(nt)   |   Continuous: A = Pe^(rt)',
        },
      ],
      concepts: [
        'log(x) without a written base denotes base 10; ln(x) denotes natural logarithm base e ≈ 2.71828.',
        'The domain of y = log_b(x − h) is x > h, with a vertical asymptote at x = h.',
        'Since exponential and logarithmic functions are inverses, b^(log_b x) = x and log_b(b^x) = x.',
      ],
      example: {
        prompt: '$1,500 is invested at 4% annual interest compounded continuously. Find the balance after 5 years.',
        steps: [
          'Use A = Pe^(rt) with P = 1500, r = 0.04, t = 5.',
          'Compute exponent: rt = 0.04 × 5 = 0.20.',
          'Evaluate 1500 · e^(0.20) ≈ 1500 · 1.2214 = $1,832.10.',
        ],
        answer: '$1,832.10',
      },
      practice: [
        {
          question: 'Evaluate log₂(1/16).',
          options: ['−4', '4', '−1/4', '−8'],
          correctIndex: 0,
          explanation: 'Since 2⁻⁴ = 1/16, log₂(1/16) = −4.',
        },
        {
          question: 'What is the vertical asymptote of f(x) = ln(x + 4) − 2?',
          options: ['x = 4', 'x = −4', 'y = −2', 'x = 2'],
          correctIndex: 1,
          explanation: 'The argument x + 4 must exceed 0, placing the vertical asymptote where x + 4 = 0, i.e., x = −4.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'properties-of-logarithms',
      title: 'Logarithm Properties & Solving Equations',
      summary:
        'Expand and condense logarithmic expressions using product, quotient, and power rules, apply change of base, and solve exponential and logarithmic equations.',
      objectives: [
        'Apply product, quotient, and power laws of logarithms.',
        'Use change-of-base formula to compute non-base-10 logs.',
        'Solve exponential equations by taking logs and log equations by exponentiating.',
      ],
      formulas: [
        {
          label: 'Product & Quotient Laws',
          expression: 'log_b(MN) = log_b M + log_b N   |   log_b(M/N) = log_b M − log_b N',
        },
        {
          label: 'Power Law & Change of Base',
          expression: 'log_b(M^k) = k·log_b M   |   log_b(a) = ln(a) / ln(b)',
        },
      ],
      concepts: [
        'Logarithm rules do NOT split sums inside the argument: log(M + N) ≠ log M + log N.',
        'When solving log equations, condense into a single log first, convert to exponential form, and reject values that make any original argument ≤ 0.',
      ],
      example: {
        prompt: 'Solve log₂(x) + log₂(x − 6) = 4.',
        steps: [
          'Condense using product law: log₂(x(x − 6)) = 4.',
          'Rewrite in exponential form: x(x − 6) = 2⁴ = 16.',
          'Solve quadratic: x² − 6x − 16 = 0 ⇒ (x − 8)(x + 2) = 0 ⇒ x = 8 or x = −2.',
          'Reject x = −2 (argument must be positive). Only x = 8 is valid.',
        ],
        answer: 'x = 8',
      },
      practice: [
        {
          question: 'Condense 2 ln(x) − 3 ln(y) into a single logarithm.',
          options: ['ln(2x − 3y)', 'ln(x² / y³)', 'ln(x²y³)', 'ln(x/y)⁻¹'],
          correctIndex: 1,
          explanation: 'Move coefficients to exponents (ln x² − ln y³) and apply quotient law: ln(x²/y³).',
        },
        {
          question: 'Solve 5^x = 40 for x.',
          options: ['x = 8', 'x = ln(40) / ln(5)', 'x = ln(5) / ln(40)', 'x = log(35)'],
          correctIndex: 1,
          explanation: 'Take ln of both sides: x ln 5 = ln 40 ⇒ x = ln(40)/ln(5) ≈ 2.292.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'conic-sections',
      title: 'Conic Sections: Parabolas, Circles, Ellipses & Hyperbolas',
      summary:
        'Classify conic sections from general equations, complete the square to write standard form, and identify centers, vertices, foci, and asymptotes.',
      objectives: [
        'Write equations of circles, ellipses, and hyperbolas in standard form.',
        'Calculate focal distance c for ellipses (c² = a² − b²) and hyperbolas (c² = a² + b²).',
        'Identify asymptote slopes of a hyperbola.',
      ],
      formulas: [
        {
          label: 'Ellipse Standard Form',
          expression: '(x−h)²/a² + (y−k)²/b² = 1   (foci: c² = |a² − b²|)',
        },
        {
          label: 'Hyperbola Standard Form',
          expression: '(x−h)²/a² − (y−k)²/b² = 1   (foci: c² = a² + b²)',
        },
        {
          label: 'Parabola Focal Form',
          expression: '(x − h)² = 4p(y − k)   (focus p units from vertex)',
        },
      ],
      concepts: [
        'In an ellipse, a² is always the larger denominator; its axis holds the vertices and foci.',
        'In a hyperbola, the positive term determines the transverse axis direction, regardless of which denominator is larger.',
        'Asymptotes of a hyperbola centered at (h, k) have slopes ±(rise/run) = ±(√denom_y / √denom_x).',
      ],
      example: {
        prompt: 'Find the center, vertices, and foci of x²/25 + y²/9 = 1.',
        steps: [
          'Center is (0, 0). Since 25 > 9 and under x², major axis is horizontal with a = 5 and b = 3.',
          'Vertices along x-axis: (±5, 0). Co-vertices: (0, ±3).',
          'Focal distance: c² = a² − b² = 25 − 9 = 16 ⇒ c = 4.',
          'Foci: (±4, 0).',
        ],
        answer: 'Center (0,0), Vertices (±5,0), Foci (±4,0)',
      },
      practice: [
        {
          question: 'Find the foci of the hyperbola x²/16 − y²/9 = 1.',
          options: ['(±√7, 0)', '(±5, 0)', '(0, ±5)', '(±4, 0)'],
          correctIndex: 1,
          explanation: 'For a hyperbola, c² = a² + b² = 16 + 9 = 25 ⇒ c = 5. Positive term is x², so foci are (±5, 0).',
        },
        {
          question: 'Which conic is represented by 4x² + 9y² − 36 = 0?',
          options: ['Circle', 'Hyperbola', 'Ellipse', 'Parabola'],
          correctIndex: 2,
          explanation: 'Dividing by 36 yields x²/9 + y²/4 = 1, an ellipse with unequal positive coefficients.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'sequences-series',
      title: 'Arithmetic & Geometric Sequences & Series',
      summary:
        'Write explicit and recursive formulas for arithmetic and geometric sequences, compute finite partial sums with sigma notation, and evaluate convergent infinite geometric series.',
      objectives: [
        'Identify common difference d vs. common ratio r.',
        'Evaluate finite arithmetic and geometric series.',
        'Determine when an infinite geometric series converges (|r| < 1).',
      ],
      formulas: [
        {
          label: 'Arithmetic Sequence & Sum',
          expression: 'a_n = a₁ + (n − 1)d   |   S_n = (n/2)(a₁ + a_n)',
        },
        {
          label: 'Geometric Sequence & Finite Sum',
          expression: 'a_n = a₁·r^(n−1)   |   S_n = a₁(1 − r^n)/(1 − r)',
        },
        {
          label: 'Infinite Geometric Sum',
          expression: 'S_∞ = a₁ / (1 − r)   when |r| < 1',
        },
      ],
      concepts: [
        'Arithmetic sequences grow linearly by adding a constant d; geometric sequences grow exponentially by multiplying by a constant r.',
        'If |r| ≥ 1, a nonzero infinite geometric series diverges and has no finite sum.',
        'Sigma notation Σ from k = 1 to n sums the formula evaluated at each integer k.',
      ],
      example: {
        prompt: 'Find the sum of the infinite geometric series 12 + 4 + 4/3 + 4/9 + …',
        steps: [
          'Identify first term a₁ = 12 and common ratio r = 4/12 = 1/3.',
          'Check convergence: |1/3| < 1 (converges).',
          'Compute S_∞ = 12 / (1 − 1/3) = 12 / (2/3) = 18.',
        ],
        answer: '18',
      },
      practice: [
        {
          question: 'Find the 20th term of the arithmetic sequence 5, 9, 13, 17, …',
          options: ['81', '85', '77', '80'],
          correctIndex: 0,
          explanation: 'a₁ = 5, d = 4. a₂₀ = 5 + (20 − 1)(4) = 5 + 76 = 81.',
        },
        {
          question: 'Evaluate the finite sum Σ (k=1 to 5) of 3k.',
          options: ['15', '30', '45', '50'],
          correctIndex: 2,
          explanation: 'Terms are 3, 6, 9, 12, 15. Sum = (5/2)(3 + 15) = 45.',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'combinatorics-probability-intro',
      title: 'Permutations, Combinations & Binomial Theorem',
      summary:
        'Distinguish ordered permutations from unordered combinations, expand binomials using Pascal’s Triangle, and compute basic probabilities.',
      objectives: [
        'Use Fundamental Counting Principle, nPr, and nCr appropriately.',
        'Expand (a + b)^n using binomial coefficients.',
        'Compute sample space probabilities and independent event probabilities.',
      ],
      formulas: [
        {
          label: 'Permutations (Order Matters)',
          expression: 'ₙPᵣ = n! / (n − r)!',
        },
        {
          label: 'Combinations (Order Ignored)',
          expression: 'ₙCᵣ = n! / (r!(n − r)!)',
        },
        {
          label: 'Binomial Theorem',
          expression: '(a + b)^n = Σ ₙCₖ a^(n−k) b^k   (k = 0 to n)',
        },
      ],
      concepts: [
        'Use permutations when positions or roles differ (e.g., president, vice president, treasurer); use combinations when selecting an unranked committee.',
        'In the Binomial Theorem, the k-th term (starting from k = 0) has exponents summing to n.',
        '0! is defined as 1 so that ₙC₀ = ₙCₙ = 1.',
      ],
      example: {
        prompt: 'Find the coefficient of x³ in the expansion of (x + 2)⁵.',
        steps: [
          'Match exponent of x: n = 5, a = x, b = 2, so we need a³ · b² (k = 2).',
          'Term is ₅C₂ · x³ · 2².',
          'Compute ₅C₂ = (5·4)/2 = 10 and 2² = 4.',
          'Coefficient = 10 × 4 = 40 (term is 40x³).',
        ],
        answer: '40',
      },
      practice: [
        {
          question: 'How many 3-person committees can be chosen from 8 students?',
          options: ['336', '56', '24', '512'],
          correctIndex: 1,
          explanation: 'Order does not matter for a committee: ₈C₃ = (8×7×6)/(3×2×1) = 56.',
        },
        {
          question: 'How many ways can 1st, 2nd, and 3rd place ribbons be awarded among 6 runners?',
          options: ['20', '18', '120', '216'],
          correctIndex: 2,
          explanation: 'Order matters: ₆P₃ = 6 × 5 × 4 = 120.',
        },
      ],
    },
  ],
};
