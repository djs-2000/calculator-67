import { type MathCourse } from '../types';

export const calculusCourse: MathCourse = {
  slug: 'calculus',
  title: 'AP Calculus AB/BC',
  level: 'Differential & Integral · Grade 12',
  summary:
    'Limits, continuity, differentiation rules, related rates, optimization, curve sketching, Riemann sums, Fundamental Theorem of Calculus, and differential equations.',
  pages: [
    {
      pageNumber: 1,
      slug: 'limits-graphical-algebraic',
      title: 'Limits: Graphical & Algebraic Evaluation',
      summary:
        'Evaluate one-sided and two-sided limits analytically by factoring, rationalizing conjugates, and applying special trigonometric limits and limits at infinity.',
      objectives: [
        'Verify two-sided limit existence by comparing left- and right-hand limits.',
        'Resolve 0/0 indeterminate forms via factoring or conjugate multiplication.',
        'Apply lim(x→0) sin(x)/x = 1 and horizontal asymptote limits at ±∞.',
      ],
      formulas: [
        {
          label: 'Existence of a Two-Sided Limit',
          expression: 'lim(x→c) f(x) = L  ⇔  lim(x→c⁻) f(x) = lim(x→c⁺) f(x) = L',
        },
        {
          label: 'Special Trig Limits',
          expression: 'lim(x→0) sin(x)/x = 1   |   lim(x→0) (1 − cos x)/x = 0',
        },
      ],
      concepts: [
        'Always try direct substitution first; only factor, expand, or rationalize when direct substitution produces 0/0.',
        'If substitution gives k/0 with k ≠ 0, the limit tends toward +∞, −∞, or Does Not Exist (vertical asymptote).',
        'At ±∞, compare dominant highest-power terms in numerator and denominator.',
      ],
      example: {
        prompt: 'Evaluate lim (x → 0) (√(x + 9) − 3) / x.',
        steps: [
          'Direct substitution yields (3 − 3)/0 = 0/0.',
          'Multiply numerator and denominator by conjugate (√(x + 9) + 3).',
          'Numerator simplifies to (x + 9) − 9 = x; cancel x with denominator.',
          'Evaluate remaining limit: lim (x → 0) 1 / (√(x + 9) + 3) = 1 / (3 + 3) = 1/6.',
        ],
        answer: '1/6',
      },
      practice: [
        {
          question: 'Evaluate lim (x → 0) sin(5x) / (2x).',
          options: ['0', '1', '5/2', '2/5'],
          correctIndex: 2,
          explanation: 'Rewrite as (5/2) · [sin(5x)/(5x)] → (5/2)(1) = 5/2.',
        },
        {
          question: 'Evaluate lim (x → ∞) (4x³ − 2x) / (8x³ + 5).',
          options: ['0', '1/2', '−2/5', '∞'],
          correctIndex: 1,
          explanation: 'Degrees match (both 3), so divide leading coefficients: 4/8 = 1/2.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'continuity-ivt-lhopital',
      title: 'Continuity, IVT & L’Hôpital’s Rule',
      summary:
        'Prove continuity at a point using the three-part definition, apply the Intermediate Value Theorem, and evaluate 0/0 or ∞/∞ limits using L’Hôpital’s Rule.',
      objectives: [
        'Check all three conditions for continuity at x = c.',
        'Distinguish removable, jump, and infinite discontinuities.',
        'Justify root existence using the Intermediate Value Theorem (IVT).',
      ],
      formulas: [
        {
          label: 'Continuity at x = c',
          expression: '1) f(c) defined  2) lim(x→c) f(x) exists  3) lim(x→c) f(x) = f(c)',
        },
        {
          label: 'L’Hôpital’s Rule (0/0 or ±∞/±∞)',
          expression: 'lim(x→c) f(x)/g(x) = lim(x→c) f′(x)/g′(x)',
          note: 'State indeterminate form before differentiating top & bottom separately.',
        },
      ],
      concepts: [
        'On free-response justifications for IVT, explicitly state that f is continuous on the closed interval [a, b].',
        'Never apply Quotient Rule in L’Hôpital’s Rule; differentiate numerator and denominator independently.',
        'Removable discontinuities (holes) occur when the limit exists but does not equal f(c).',
      ],
      example: {
        prompt: 'Find k so that f(x) = { kx² − 1 if x ≤ 2; 3x + 1 if x > 2 } is continuous at x = 2.',
        steps: [
          'Left-hand limit & value: f(2) = lim(x→2⁻) (kx² − 1) = 4k − 1.',
          'Right-hand limit: lim(x→2⁺) (3x + 1) = 7.',
          'Set equal: 4k − 1 = 7 ⇒ 4k = 8 ⇒ k = 2.',
        ],
        answer: 'k = 2',
      },
      practice: [
        {
          question: 'Evaluate lim (x → 0) (e^(2x) − 1) / x using L’Hôpital’s Rule.',
          options: ['0', '1', '2', 'e'],
          correctIndex: 2,
          explanation: 'Form is 0/0. Differentiating top and bottom gives lim(x→0) 2e^(2x) / 1 = 2.',
        },
        {
          question: 'f is continuous on [1, 4] with f(1) = −3 and f(4) = 5. Which theorem guarantees f(c) = 0 for some c in (1, 4)?',
          options: ['Mean Value Theorem', 'Intermediate Value Theorem', 'Extreme Value Theorem', 'Rolle’s Theorem'],
          correctIndex: 1,
          explanation: 'Since 0 lies between f(1) = −3 and f(4) = 5 and f is continuous, IVT guarantees at least one c in (1, 4) with f(c) = 0.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'derivative-definition-basic-rules',
      title: 'Derivatives: Definition, Power, Product & Quotient Rules',
      summary:
        'Connect derivatives to instantaneous rates of change and tangent line slopes, and differentiate polynomials, products, quotients, and trigonometric functions.',
      objectives: [
        'Recognize the limit definition of derivative f′(x) and f′(a).',
        'Apply Power, Product, and Quotient Rules accurately.',
        'Write equations of tangent and normal lines.',
      ],
      formulas: [
        {
          label: 'Limit Definition of Derivative',
          expression: 'f′(x) = lim(h→0) [f(x + h) − f(x)] / h',
        },
        {
          label: 'Product & Quotient Rules',
          expression: '(fg)′ = f′g + fg′   |   (f/g)′ = (f′g − fg′) / g²',
        },
        {
          label: 'Basic Trig Derivatives',
          expression: '(sin x)′ = cos x  |  (cos x)′ = −sin x  |  (tan x)′ = sec²x',
        },
      ],
      concepts: [
        'Differentiability at x = c implies continuity at x = c, though continuity does not guarantee differentiability (corners, cusps, vertical tangents).',
        'Quotient Rule numerator order matters strictly: low d-high minus high d-low, over low squared.',
        'A normal line has slope equal to the negative reciprocal −1/f′(a) of the tangent line slope.',
      ],
      example: {
        prompt: 'Find the equation of the tangent line to y = x³ − 2x + 5 at x = 2.',
        steps: [
          'Find y-coordinate: y(2) = 8 − 4 + 5 = 9 ⇒ point (2, 9).',
          'Differentiate: y′ = 3x² − 2.',
          'Evaluate slope at x = 2: m = 3(4) − 2 = 10.',
          'Write tangent line: y − 9 = 10(x − 2) ⇒ y = 10x − 11.',
        ],
        answer: 'y = 10x − 11',
      },
      practice: [
        {
          question: 'Differentiate f(x) = x² sin x.',
          options: ['2x cos x', '2x sin x + x² cos x', '2x sin x − x² cos x', 'x² cos x'],
          correctIndex: 1,
          explanation: 'Product Rule: (x²)′ sin x + x² (sin x)′ = 2x sin x + x² cos x.',
        },
        {
          question: 'What does lim(h→0) [(3 + h)⁴ − 3⁴] / h represent?',
          options: ['Derivative of x⁴ at x = 3', 'Derivative of 3⁴ at x = 0', 'Integral of x⁴', 'Slope at x = 0'],
          correctIndex: 0,
          explanation: 'Matches [f(a + h) − f(a)] / h for f(x) = x⁴ at a = 3, which equals 4(3)³ = 108.',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'chain-rule-implicit-differentiation',
      title: 'Chain Rule, Implicit Differentiation & Related Rates',
      summary:
        'Differentiate composite and implicitly defined relations, and solve multi-variable related rates problems with respect to time t.',
      objectives: [
        'Apply Chain Rule cleanly across nested composite functions.',
        'Differentiate equations like x² + y² = 25 implicitly to find dy/dx.',
        'Set up geometric rates equations and substitute known values only after differentiating.',
      ],
      formulas: [
        {
          label: 'Chain Rule',
          expression: 'd/dx [f(g(x))] = f′(g(x)) · g′(x)',
        },
        {
          label: 'Related Rates Protocol',
          expression: '1) Equation  2) Differentiate w.r.t. t  3) Substitute known rates/values',
        },
      ],
      concepts: [
        'When differentiating a y-term with respect to x, multiply by dy/dx; when differentiating any variable with respect to t, multiply by d(var)/dt.',
        'Never plug in changing numerical snapshots (like radius r = 5) before differentiating.',
      ],
      example: {
        prompt: 'A balloon’s radius increases at dr/dt = 2 cm/s. Find dV/dt when r = 3 cm (V = 4/3 πr³).',
        steps: [
          'Differentiate both sides w.r.t. t: dV/dt = 4πr² · (dr/dt).',
          'Substitute r = 3 and dr/dt = 2: dV/dt = 4π(3²)(2) = 72π cm³/s.',
        ],
        answer: '72π cm³/s',
      },
      practice: [
        {
          question: 'Find dy/dx for y = (3x² + 1)⁵.',
          options: ['5(3x² + 1)⁴', '30x(3x² + 1)⁴', '5(6x)⁴', '15x(3x² + 1)⁴'],
          correctIndex: 1,
          explanation: 'Outer derivative 5(3x² + 1)⁴ times inner derivative 6x equals 30x(3x² + 1)⁴.',
        },
        {
          question: 'Find dy/dx at (3, 4) on the circle x² + y² = 25.',
          options: ['−3/4', '3/4', '−4/3', '4/3'],
          correctIndex: 0,
          explanation: '2x + 2y(dy/dx) = 0 ⇒ dy/dx = −x/y = −3/4.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'exponentials-logs-inverse-trig-derivatives',
      title: 'Exponential, Logarithmic & Inverse Function Derivatives',
      summary:
        'Differentiate natural and general exponentials/logarithms, inverse trigonometric functions, and inverse functions at a point.',
      objectives: [
        'Differentiate e^u, a^u, ln(u), and log_a(u).',
        'Recall derivatives of arcsin(u) and arctan(u).',
        'Compute (f⁻¹)′(b) = 1 / f′(f⁻¹(b)).',
      ],
      formulas: [
        {
          label: 'Exponential & Log Derivatives',
          expression: '(e^u)′ = e^u·u′  |  (a^u)′ = a^u ln(a)·u′  |  (ln u)′ = u′/u',
        },
        {
          label: 'Inverse Trig Derivatives',
          expression: '(arcsin x)′ = 1/√(1 − x²)   |   (arctan x)′ = 1/(1 + x²)',
        },
        {
          label: 'Inverse Function Derivative',
          expression: '(f⁻¹)′(b) = 1 / f′(a)   where f(a) = b',
        },
      ],
      concepts: [
        'To evaluate (f⁻¹)′(b), solve f(a) = b first to find the matching input a, then take the reciprocal of f′(a).',
        'Logarithmic differentiation takes ln of both sides to simplify products, quotients, or variable exponents like x^x.',
      ],
      example: {
        prompt: 'If f(x) = x³ + x, find (f⁻¹)′(2).',
        steps: [
          'Find a such that f(a) = 2: a³ + a = 2 ⇒ a = 1.',
          'Differentiate f: f′(x) = 3x² + 1 ⇒ f′(1) = 4.',
          'Take reciprocal: (f⁻¹)′(2) = 1 / 4.',
        ],
        answer: '1/4',
      },
      practice: [
        {
          question: 'Differentiate y = ln(x² + 4).',
          options: ['1 / (x² + 4)', '2x / (x² + 4)', '2x ln(x² + 4)', '1 / (2x)'],
          correctIndex: 1,
          explanation: 'By Chain Rule, (ln u)′ = u′ / u = 2x / (x² + 4).',
        },
        {
          question: 'Differentiate y = arctan(3x).',
          options: ['1 / (1 + 9x²)', '3 / (1 + 9x²)', '3 / √(1 − 9x²)', '1 / (1 + 3x²)'],
          correctIndex: 1,
          explanation: '(arctan u)′ = u′ / (1 + u²) = 3 / (1 + (3x)²) = 3 / (1 + 9x²).',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'mvt-curve-sketching-extrema',
      title: 'MVT, Extrema, Concavity & Curve Sketching',
      summary:
        'Apply Rolle’s Theorem and the Mean Value Theorem, classify critical points via the First and Second Derivative Tests, and identify inflection points from f″.',
      objectives: [
        'State conditions and conclusion of the Mean Value Theorem.',
        'Determine intervals of increase/decrease from f′ and concavity from f″.',
        'Locate points of inflection where f″ changes sign.',
      ],
      formulas: [
        {
          label: 'Mean Value Theorem (MVT)',
          expression: 'f′(c) = [f(b) − f(a)] / (b − a)   (f continuous on [a,b], diff. on (a,b))',
        },
        {
          label: 'Second Derivative Test at f′(c) = 0',
          expression: 'f″(c) > 0: Local Min (concave up)  |  f″(c) < 0: Local Max (concave down)',
        },
      ],
      concepts: [
        'A critical number occurs where f′(c) = 0 or f′(c) is undefined (and c is in the domain of f).',
        'f″(c) = 0 alone does NOT prove an inflection point; f″ must actually change sign across c.',
        'On exams, always justify local maxima/minima using sign changes of f′ rather than vague phrases like "the slope changes".',
      ],
      example: {
        prompt: 'Find the local extrema and inflection point of f(x) = x³ − 3x² + 2.',
        steps: [
          'f′(x) = 3x² − 6x = 3x(x − 2) = 0 ⇒ critical points at x = 0 and x = 2.',
          'f″(x) = 6x − 6. At x = 0, f″(0) = −6 < 0 (local max at (0, 2)). At x = 2, f″(2) = 6 > 0 (local min at (2, −2)).',
          'Set f″(x) = 0 ⇒ x = 1; f″ changes from − to +, so (1, 0) is an inflection point.',
        ],
        answer: 'Local max (0, 2), Local min (2, −2), Inflection (1, 0)',
      },
      practice: [
        {
          question: 'If f′(x) changes from negative to positive at x = 4, what occurs at x = 4?',
          options: ['Local maximum', 'Local minimum', 'Inflection point', 'Vertical asymptote'],
          correctIndex: 1,
          explanation: 'Decreasing before x = 4 and increasing after x = 4 creates a local minimum.',
        },
        {
          question: 'Find c guaranteed by MVT for f(x) = x² on [1, 5].',
          options: ['2', '3', '4', '2.5'],
          correctIndex: 1,
          explanation: 'Average rate = (25 − 1)/(5 − 1) = 6. Set f′(c) = 2c = 6 ⇒ c = 3.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'optimization-linearization',
      title: 'Absolute Extrema, Optimization & Linearization',
      summary:
        'Find global maxima and minima on closed intervals via the Candidates Test, solve applied optimization problems, and approximate values with tangent line linearization.',
      objectives: [
        'Apply the Candidates Test (critical points + endpoints) for absolute extrema.',
        'Translate geometric/cost constraints into single-variable optimization functions.',
        'Use tangent line approximation L(x) = f(a) + f′(a)(x − a) and determine over/underestimates via concavity.',
      ],
      formulas: [
        {
          label: 'Linear Approximation',
          expression: 'L(x) = f(a) + f′(a)(x − a)',
          note: 'Overestimate if f is concave down (f″ < 0); underestimate if concave up (f″ > 0).',
        },
      ],
      concepts: [
        'Extreme Value Theorem guarantees a continuous function on a closed interval [a, b] attains both an absolute maximum and an absolute minimum.',
        'Always evaluate f(x) at endpoints AND interior critical numbers when finding absolute extrema.',
      ],
      example: {
        prompt: 'Find two positive numbers whose sum is 20 and whose product is maximized.',
        steps: [
          'Let numbers be x and y with x + y = 20 ⇒ y = 20 − x.',
          'Product P(x) = x(20 − x) = 20x − x² on (0, 20).',
          'P′(x) = 20 − 2x = 0 ⇒ x = 10; P″(x) = −2 < 0 confirms maximum.',
          'Both numbers are 10 and 10 (max product 100).',
        ],
        answer: '10 and 10',
      },
      practice: [
        {
          question: 'A curve has f(2) = 5, f′(2) = 3, and f″(x) < 0 near 2. The tangent-line approximation for f(2.1) is:',
          options: ['5.3, an overestimate', '5.3, an underestimate', '4.7, an overestimate', '5.03, an underestimate'],
          correctIndex: 0,
          explanation: 'L(2.1) = 5 + 3(0.1) = 5.3. Since f″ < 0 (concave down), the tangent line sits above the curve (overestimate).',
        },
        {
          question: 'Find the absolute maximum value of f(x) = x² − 4x + 1 on [0, 3].',
          options: ['−3', '1', '−2', '4'],
          correctIndex: 1,
          explanation: 'Critical point at x = 2 gives f(2) = −3; endpoints give f(0) = 1 and f(3) = −2. Absolute max is 1.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'riemann-sums-ftc',
      title: 'Riemann Sums & Fundamental Theorem of Calculus',
      summary:
        'Approximate definite integrals using Left, Right, Midpoint, and Trapezoidal sums, and evaluate accumulation functions and definite integrals with both parts of the FTC.',
      objectives: [
        'Compute Left, Right, Midpoint, and Trapezoidal approximations.',
        'Apply FTC Part 1: d/dx ∫_a^x f(t)dt = f(x) (and with Chain Rule).',
        'Apply FTC Part 2: ∫_a^b f(x)dx = F(b) − F(a).',
      ],
      formulas: [
        {
          label: 'FTC Part 1 (with Chain Rule)',
          expression: 'd/dx [ ∫_a^(g(x)) f(t) dt ] = f(g(x)) · g′(x)',
        },
        {
          label: 'FTC Part 2 & Net Change',
          expression: '∫_a^b f(x) dx = F(b) − F(a)   |   Average value = 1/(b−a) ∫_a^b f(x) dx',
        },
        {
          label: 'Trapezoidal Rule (equal Δx)',
          expression: 'T = (Δx / 2) · [f(x₀) + 2f(x₁) + … + 2f(x_{n−1}) + f(x_n)]',
        },
      ],
      concepts: [
        'Left Riemann sums underestimate increasing functions and overestimate decreasing functions.',
        'Reversing integration bounds negates the integral: ∫_b^a f(x)dx = −∫_a^b f(x)dx.',
        'Integrating a rate of change ∫_a^b r(t)dt computes net change over [a, b], not total value at t = b (always add initial value!).',
      ],
      example: {
        prompt: 'Compute d/dx ∫_1^(x²) cos(t) dt.',
        steps: [
          'Apply FTC Part 1 with upper limit g(x) = x².',
          'Substitute g(x) into integrand: cos(x²).',
          'Multiply by g′(x) = 2x.',
        ],
        answer: '2x cos(x²)',
      },
      practice: [
        {
          question: 'Evaluate ∫_0^2 (3x² + 2) dx.',
          options: ['8', '12', '10', '14'],
          correctIndex: 1,
          explanation: 'Antiderivative is x³ + 2x. At 2: 8 + 4 = 12; at 0: 0. Result = 12.',
        },
        {
          question: 'Which sum always underestimates ∫_a^b f(x) dx when f is positive and strictly increasing?',
          options: ['Right Riemann sum', 'Left Riemann sum', 'Upper sum', 'Both Left and Right'],
          correctIndex: 1,
          explanation: 'When f is increasing, the left endpoint of every subinterval is the lowest height, so Left Riemann sum underestimates.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'integration-techniques',
      title: 'U-Substitution, Integration by Parts & Partial Fractions',
      summary:
        'Evaluate indefinite and definite integrals using substitution (updating bounds), Integration by Parts (BC), simple partial fractions, and improper integrals.',
      objectives: [
        'Perform u-substitution and transform definite integral limits.',
        'Apply Integration by Parts ∫u dv = uv − ∫v du.',
        'Evaluate improper integrals with infinite bounds as limits.',
      ],
      formulas: [
        {
          label: 'Integration by Parts',
          expression: '∫ u dv = u·v − ∫ v du   (LIATE order for choosing u)',
        },
        {
          label: 'Standard Antiderivatives',
          expression: '∫ (1/x)dx = ln|x| + C   |   ∫ 1/(1+x²)dx = arctan x + C',
        },
      ],
      concepts: [
        'When changing variables via u-substitution in a definite integral, update both limits of integration to u-values.',
        'Split improper integrals at infinite bounds or vertical asymptotes into limits before integrating.',
        '∫_1^∞ (1/x^p) dx converges if and only if p > 1.',
      ],
      example: {
        prompt: 'Evaluate ∫_0^1 x e^(x²) dx.',
        steps: [
          'Let u = x², so du = 2x dx ⇒ x dx = (1/2) du.',
          'Update bounds: x = 0 ⇒ u = 0; x = 1 ⇒ u = 1.',
          'Integrate: (1/2) ∫_0^1 e^u du = (1/2)(e¹ − e⁰) = (e − 1)/2.',
        ],
        answer: '(e − 1)/2',
      },
      practice: [
        {
          question: 'Evaluate ∫_1^∞ (1 / x²) dx.',
          options: ['Diverges', '1', '1/2', '0'],
          correctIndex: 1,
          explanation: 'lim(b→∞) [−1/x]_1^b = lim(b→∞) (−1/b + 1) = 1.',
        },
        {
          question: 'Evaluate ∫ (4 / (1 + x²)) dx.',
          options: ['4 ln(1 + x²) + C', '4 arctan(x) + C', '4 arcsin(x) + C', '−8x/(1+x²)² + C'],
          correctIndex: 1,
          explanation: '∫ 1/(1+x²) dx = arctan x + C, multiplied by constant 4.',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'area-volume-differential-equations',
      title: 'Area, Volumes by Cross-Section & Differential Equations',
      summary:
        'Compute area between curves, volumes by disks, washers, and known cross-sections, sketch slope fields, and solve separable differential equations.',
      objectives: [
        'Set up area integrals (top − bottom or right − left).',
        'Calculate volumes of revolution with disks π∫R² and washers π∫(R² − r²).',
        'Solve separable ODEs dy/dx = g(x)h(y) with initial conditions.',
      ],
      formulas: [
        {
          label: 'Area & Known Cross-Sections',
          expression: 'Area = ∫_a^b (Top − Bottom) dx   |   Volume = ∫_a^b A(x) dx',
        },
        {
          label: 'Washer Method Volume',
          expression: 'V = π ∫_a^b ([R(x)]² − [r(x)]²) dx',
        },
        {
          label: 'Exponential Differential Equation',
          expression: 'dy/dt = ky  ⇒  y(t) = y₀ e^(kt)',
        },
      ],
      concepts: [
        'Always subtract R² − r² BEFORE squaring is wrong—square each radius separately: R² − r², NEVER (R − r)².',
        'When separating variables, move all y factors with dy and all x factors with dx, integrate both sides, and solve for +C immediately using the initial condition.',
      ],
      example: {
        prompt: 'Solve dy/dx = 2xy with initial condition y(0) = 3.',
        steps: [
          'Separate variables (y > 0): (1/y) dy = 2x dx.',
          'Integrate both sides: ln|y| = x² + C.',
          'Plug in x = 0, y = 3: ln(3) = 0 + C ⇒ C = ln 3.',
          'Exponentiate: y = e^(x² + ln 3) = 3e^(x²).',
        ],
        answer: 'y = 3e^(x²)',
      },
      practice: [
        {
          question: 'Find the area enclosed between y = x and y = x² on [0, 1].',
          options: ['1/6', '1/3', '1/2', '1/4'],
          correctIndex: 0,
          explanation: '∫_0^1 (x − x²) dx = [x²/2 − x³/3]_0^1 = 1/2 − 1/3 = 1/6.',
        },
        {
          question: 'Find the volume generated by rotating y = √x on [0, 4] about the x-axis.',
          options: ['4π', '8π', '16π', '2π'],
          correctIndex: 1,
          explanation: 'Disk method: π ∫_0^4 (√x)² dx = π ∫_0^4 x dx = π [x²/2]_0^4 = 8π.',
        },
      ],
    },
  ],
};
