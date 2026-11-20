import { type MathCourse } from '../types';

export const precalculusCourse: MathCourse = {
  slug: 'precalculus',
  title: 'Trigonometry & Precalculus',
  level: 'Analytic Trig · Grades 11–12',
  summary:
    'Unit circle radians, sinusoidal modeling, trigonometric identities, inverse trig, Laws of Sines & Cosines, vectors, polar coordinates, and limits preview.',
  pages: [
    {
      pageNumber: 1,
      slug: 'angles-radians-unit-circle',
      title: 'Radians, Arc Length & The Unit Circle',
      summary:
        'Convert between degrees and radians, find coterminal and reference angles, and evaluate exact trigonometric values on the unit circle.',
      objectives: [
        'Convert degrees ↔ radians using π rad = 180°.',
        'Locate coterminal and reference angles across all four quadrants.',
        'Evaluate exact sin, cos, and tan at special angles (π/6, π/4, π/3, multiples of π/2).',
      ],
      formulas: [
        {
          label: 'Degree ↔ Radian Conversion',
          expression: 'Radians = Degrees × (π / 180°)   |   Degrees = Radians × (180° / π)',
        },
        {
          label: 'Unit Circle Coordinates',
          expression: 'P(θ) = (cos θ, sin θ)   |   tan θ = sin θ / cos θ',
        },
        {
          label: 'Radian Arc Length & Sector Area',
          expression: 's = rθ   |   A = ½ r²θ   (θ in radians)',
        },
      ],
      concepts: [
        'Sign rule by quadrant (ASTC): All positive in QI, Sine in QII, Tangent in QIII, Cosine in QIV.',
        'Reference angles are always positive acute angles measured to the nearest x-axis.',
        'Adding or subtracting 2π (360°) yields coterminal angles with identical trig values.',
      ],
      example: {
        prompt: 'Find the exact value of cos(5π/6) and sin(5π/6).',
        steps: [
          '5π/6 lies in Quadrant II with reference angle π − 5π/6 = π/6 (30°).',
          'At π/6, cos(π/6) = √3/2 and sin(π/6) = 1/2.',
          'In QII, x (cosine) is negative and y (sine) is positive.',
        ],
        answer: 'cos(5π/6) = −√3/2, sin(5π/6) = 1/2',
      },
      practice: [
        {
          question: 'Convert 225° to radians in simplest fraction form.',
          options: ['3π/4', '5π/4', '7π/4', '5π/6'],
          correctIndex: 1,
          explanation: '225 × π / 180 = (225/45)/(180/45) · π = 5π/4.',
        },
        {
          question: 'What is the exact value of tan(4π/3)?',
          options: ['−√3', '√3', '√3/3', '−√3/3'],
          correctIndex: 1,
          explanation: '4π/3 is in QIII where tangent is positive, with reference angle π/3. tan(π/3) = √3.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'graphs-sine-cosine',
      title: 'Graphs & Modeling of Sine & Cosine',
      summary:
        'Determine amplitude, period, phase shift, and vertical midline from sinusoidal equations and fit cosine/sine functions to periodic phenomena.',
      objectives: [
        'Extract A, B, C, and D from y = A sin(B(x − C)) + D.',
        'Compute period T = 2π/|B| and frequency 1/T.',
        'Identify five key quarter-period points to sketch one complete cycle.',
      ],
      formulas: [
        {
          label: 'Sinusoidal Standard Form',
          expression: 'y = A cos(B(x − C)) + D',
          note: 'Amplitude = |A|, Midline y = D, Phase shift = C.',
        },
        {
          label: 'Period & Frequency',
          expression: 'Period = 2π / |B|   |   B = 2π / Period',
        },
      ],
      concepts: [
        'Always factor out B inside the parentheses before reading the phase shift C.',
        'Amplitude equals half the vertical distance between maximum and minimum: (Max − Min)/2.',
        'Midline D equals the average of maximum and minimum: (Max + Min)/2.',
      ],
      example: {
        prompt: 'Find amplitude, period, phase shift, and range for y = −3 sin(2x − π) + 4.',
        steps: [
          'Factor inside: y = −3 sin(2(x − π/2)) + 4.',
          'Amplitude = |−3| = 3; Period = 2π / 2 = π; Phase shift = π/2 right; Midline = 4.',
          'Range = [4 − 3, 4 + 3] = [1, 7].',
        ],
        answer: 'Amp 3, Period π, Shift π/2 right, Range [1, 7]',
      },
      practice: [
        {
          question: 'What is the period of y = 5 cos(πx / 4) − 2?',
          options: ['π/2', '4', '8', '2π'],
          correctIndex: 2,
          explanation: 'Period = 2π / (π/4) = 2π · (4/π) = 8.',
        },
        {
          question: 'A wave oscillates between a minimum of 2 and a maximum of 14. What are its amplitude and midline?',
          options: ['Amp 6, Midline 8', 'Amp 12, Midline 8', 'Amp 6, Midline 6', 'Amp 8, Midline 6'],
          correctIndex: 0,
          explanation: 'Amplitude = (14 − 2)/2 = 6; Midline = (14 + 2)/2 = 8.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'tangent-reciprocal-trig',
      title: 'Tangent, Cotangent, Secant & Cosecant Graphs',
      summary:
        'Sketch and analyze tangent and reciprocal trigonometric functions, locating vertical asymptotes where denominators vanish.',
      objectives: [
        'Compute periods for tan/cot (π/|B|) and sec/csc (2π/|B|).',
        'Locate vertical asymptotes of tan, cot, sec, and csc.',
        'Evaluate reciprocal functions using unit circle values.',
      ],
      formulas: [
        {
          label: 'Reciprocal Definitions',
          expression: 'csc θ = 1/sin θ  |  sec θ = 1/cos θ  |  cot θ = cos θ / sin θ',
        },
        {
          label: 'Tangent & Cotangent Period',
          expression: 'Period = π / |B|',
          note: 'Half the period of sine and cosine.',
        },
      ],
      concepts: [
        'y = tan x has vertical asymptotes wherever cos x = 0 (odd multiples of π/2) and x-intercepts at integer multiples of π.',
        'y = sec x has U-shaped branches bouncing off the local maxima and minima of y = cos x.',
        'y = csc x has vertical asymptotes at integer multiples of π where sin x = 0.',
      ],
      example: {
        prompt: 'Find the period and consecutive vertical asymptotes of y = 2 tan(3x).',
        steps: [
          'Period = π / 3.',
          'Set 3x = −π/2 and 3x = π/2.',
          'Divide by 3: asymptotes at x = −π/6 and x = π/6 (and every π/3 thereafter).',
        ],
        answer: 'Period = π/3; asymptotes at x = ±π/6 + (π/3)k',
      },
      practice: [
        {
          question: 'Evaluate sec(π/3).',
          options: ['2', '1/2', '2/√3', '√3'],
          correctIndex: 0,
          explanation: 'cos(π/3) = 1/2, so sec(π/3) = 1 / (1/2) = 2.',
        },
        {
          question: 'Where does y = csc(x) have vertical asymptotes?',
          options: ['x = π/2 + πk', 'x = πk (k an integer)', 'x = 2πk', 'Nowhere'],
          correctIndex: 1,
          explanation: 'csc(x) = 1/sin(x), which is undefined whenever sin(x) = 0, i.e., x = πk.',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'fundamental-trig-identities',
      title: 'Fundamental Trigonometric Identities',
      summary:
        'Simplify trigonometric expressions and prove identities using Pythagorean, reciprocal, quotient, cofunction, and even-odd identities.',
      objectives: [
        'Use sin²θ + cos²θ = 1 and its two derived Pythagorean forms.',
        'Apply even/odd symmetry (cos is even; sin and tan are odd).',
        'Verify algebraic trig identities by transforming one side independently.',
      ],
      formulas: [
        {
          label: 'Pythagorean Identities',
          expression: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = csc²θ',
        },
        {
          label: 'Even-Odd Identities',
          expression: 'cos(−θ) = cos θ   |   sin(−θ) = −sin θ   |   tan(−θ) = −tan θ',
        },
        {
          label: 'Cofunction Identities',
          expression: 'sin(π/2 − θ) = cos θ   |   tan(π/2 − θ) = cot θ',
        },
      ],
      concepts: [
        'Converting everything into sin θ and cos θ is a reliable fallback strategy when verifying identities.',
        'When proving an identity, work strictly on one side (usually the more complex side) until it matches the other.',
        'Factoring difference of squares (1 − cos²x = sin²x) and common denominators unlock most identity proofs.',
      ],
      example: {
        prompt: 'Simplify (sec²θ − 1) / sec²θ.',
        steps: [
          'Apply Pythagorean identity 1 + tan²θ = sec²θ ⇒ sec²θ − 1 = tan²θ.',
          'Rewrite tan²θ / sec²θ in terms of sine and cosine: (sin²θ / cos²θ) ÷ (1 / cos²θ).',
          'Cancel cos²θ: result is sin²θ.',
        ],
        answer: 'sin²θ',
      },
      practice: [
        {
          question: 'Simplify cos(−x) · tan(−x).',
          options: ['sin x', '−sin x', 'cos x', '−cos x'],
          correctIndex: 1,
          explanation: 'cos(−x) = cos x and tan(−x) = −tan x = −sin x / cos x. Multiplying gives −sin x.',
        },
        {
          question: 'Which expression is identically equal to 1 + cot²θ?',
          options: ['sec²θ', 'tan²θ', 'csc²θ', '−sin²θ'],
          correctIndex: 2,
          explanation: 'Dividing sin²θ + cos²θ = 1 by sin²θ yields 1 + cot²θ = csc²θ.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'sum-difference-double-angle',
      title: 'Sum, Difference, Double-Angle & Half-Angle Formulas',
      summary:
        'Compute exact trigonometric values for non-standard angles like 15° or 75°, and rewrite expressions using double-angle and power-reducing identities.',
      objectives: [
        'Apply sin(α ± β), cos(α ± β), and tan(α ± β).',
        'Use all three forms of cos(2θ) and sin(2θ) = 2 sin θ cos θ.',
        'Apply half-angle formulas and select the correct sign by quadrant.',
      ],
      formulas: [
        {
          label: 'Sum & Difference',
          expression: 'sin(α±β) = sinα cosβ ± cosα sinβ  |  cos(α±β) = cosα cosβ ∓ sinα sinβ',
        },
        {
          label: 'Double-Angle Identities',
          expression: 'sin(2θ) = 2 sinθ cosθ  |  cos(2θ) = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ',
        },
        {
          label: 'Power-Reducing Formulas',
          expression: 'sin²θ = (1 − cos 2θ)/2   |   cos²θ = (1 + cos 2θ)/2',
        },
      ],
      concepts: [
        'For cos(α + β), remember the signs flip: cosine stays with cosine, sine with sine, and + becomes −.',
        'cos(2θ) has three equivalent forms—pick 1 − 2sin²θ or 2cos²θ − 1 to isolate a single trig function.',
        'Never distribute a trig function across parentheses: sin(α + β) ≠ sin α + sin β.',
      ],
      example: {
        prompt: 'Find the exact value of sin(75°) using 45° + 30°.',
        steps: [
          'sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30°.',
          'Substitute exact values: (√2/2)(√3/2) + (√2/2)(1/2).',
          'Combine over common denominator 4: (√6 + √2) / 4.',
        ],
        answer: '(√6 + √2) / 4',
      },
      practice: [
        {
          question: 'If sin θ = 3/5 and θ is in Quadrant II, find sin(2θ).',
          options: ['−24/25', '24/25', '−7/25', '6/5'],
          correctIndex: 0,
          explanation: 'In QII, cos θ = −4/5. Thus sin(2θ) = 2(3/5)(−4/5) = −24/25.',
        },
        {
          question: 'Simplify cos(50°)cos(10°) − sin(50°)sin(10°).',
          options: ['cos(40°)', 'cos(60°) = 1/2', 'sin(60°)', 'sin(40°)'],
          correctIndex: 1,
          explanation: 'This matches cos(α + β) = cos(50° + 10°) = cos(60°) = 1/2.',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'solving-trig-equations-inverses',
      title: 'Inverse Trig Functions & Trigonometric Equations',
      summary:
        'Evaluate inverse trigonometric functions within principal ranges and solve algebraic and quadratic trigonometric equations over [0, 2π) and all real numbers.',
      objectives: [
        'Respect principal range restrictions of arcsin, arccos, and arctan.',
        'Find all solutions in [0, 2π) and write general periodic solutions.',
        'Solve quadratic-in-trig equations by factoring or substitution.',
      ],
      formulas: [
        {
          label: 'Principal Ranges',
          expression: 'arcsin, arctan: [−π/2, π/2] (QI/QIV)  |  arccos: [0, π] (QI/QII)',
        },
        {
          label: 'General Solutions',
          expression: 'sin/cos: θ + 2πk   |   tan: θ + πk   (k ∈ ℤ)',
        },
      ],
      concepts: [
        'Because arcsin(−1/2) must return an angle in [−π/2, π/2], the output is −π/6, NOT 11π/6.',
        'Check compositions like arccos(cos(7π/6)) carefully: the answer must sit in [0, π], giving 5π/6.',
        'Avoid dividing both sides of a trig equation by sin x or cos x, which discards valid zero solutions; factor instead.',
      ],
      example: {
        prompt: 'Solve 2 cos²x − cos x − 1 = 0 on [0, 2π).',
        steps: [
          'Factor as a quadratic in cos x: (2 cos x + 1)(cos x − 1) = 0.',
          'Branch 1: cos x = −1/2 ⇒ x = 2π/3, 4π/3.',
          'Branch 2: cos x = 1 ⇒ x = 0.',
        ],
        answer: 'x = 0, 2π/3, 4π/3',
      },
      practice: [
        {
          question: 'Evaluate arccos(−√2 / 2).',
          options: ['−π/4', '3π/4', '5π/4', '7π/4'],
          correctIndex: 1,
          explanation: 'arccos returns values in [0, π]. Cosine equals −√2/2 at 3π/4.',
        },
        {
          question: 'Solve sin(2x) = 1 on [0, 2π).',
          options: ['π/4, 5π/4', 'π/2', 'π/4, 3π/4', '0, π'],
          correctIndex: 0,
          explanation: '2x = π/2 + 2πk ⇒ x = π/4 + πk. In [0, 2π), x = π/4 and 5π/4.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'law-of-sines-cosines',
      title: 'Law of Sines, Law of Cosines & Triangle Area',
      summary:
        'Solve oblique triangles in AAS, ASA, SSA (ambiguous case), SAS, and SSS configurations, and compute area via sine and Heron’s formula.',
      objectives: [
        'Apply Law of Sines and check for 0, 1, or 2 triangles in the SSA ambiguous case.',
        'Apply Law of Cosines for SAS and SSS triangles.',
        'Compute oblique triangle areas without needing a perpendicular altitude.',
      ],
      formulas: [
        {
          label: 'Law of Sines',
          expression: 'a / sin A = b / sin B = c / sin C',
        },
        {
          label: 'Law of Cosines',
          expression: 'c² = a² + b² − 2ab cos C',
        },
        {
          label: 'Area Formulas',
          expression: 'A = ½ ab sin C   |   Heron: A = √(s(s−a)(s−b)(s−c)),  s = (a+b+c)/2',
        },
      ],
      concepts: [
        'Use Law of Cosines for SAS and SSS; use Law of Sines for ASA, AAS, and SSA.',
        'In the SSA ambiguous case, once sin B is found, check if the supplement (180° − B) can also fit with angle A under 180°.',
        'When using Law of Cosines on an SSS triangle, solve for the largest angle first to determine right away if it is obtuse.',
      ],
      example: {
        prompt: 'Find side c in △ABC if a = 8, b = 10, and angle C = 60°.',
        steps: [
          'Apply Law of Cosines: c² = 8² + 10² − 2(8)(10)cos(60°).',
          'Compute: c² = 64 + 100 − 160(0.5) = 164 − 80 = 84.',
          'Take square root: c = √84 = 2√21 ≈ 9.17.',
        ],
        answer: '2√21 ≈ 9.17',
      },
      practice: [
        {
          question: 'Find the area of a triangle with sides 7 and 10 and included angle 30°.',
          options: ['35', '17.5', '35√3 / 2', '70'],
          correctIndex: 1,
          explanation: 'Area = ½(7)(10)sin(30°) = 35(0.5) = 17.5.',
        },
        {
          question: 'Which triangle configuration requires Law of Cosines to start?',
          options: ['ASA', 'AAS', 'SAS', 'Right triangle hypotenuse-leg'],
          correctIndex: 2,
          explanation: 'SAS gives no opposite angle-side pair, so Law of Sines cannot start; use Law of Cosines.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'vectors-parametric-equations',
      title: '2D Vectors, Dot Products & Parametric Equations',
      summary:
        'Represent vectors in component and unit-vector form, compute magnitudes, dot products, and angles between vectors, and eliminate parameters in parametric curves.',
      objectives: [
        'Find component form, magnitude, and unit vector in the same direction.',
        'Calculate dot product u · v and test orthogonality.',
        'Convert parametric equations (x(t), y(t)) to Cartesian form.',
      ],
      formulas: [
        {
          label: 'Magnitude & Unit Vector',
          expression: '||v|| = √(v₁² + v₂²)   |   u = v / ||v||',
        },
        {
          label: 'Dot Product & Angle',
          expression: 'u · v = u₁v₁ + u₂v₂ = ||u|| ||v|| cos θ',
          note: 'Orthogonal (perpendicular) vectors satisfy u · v = 0.',
        },
      ],
      concepts: [
        'A vector from initial point P(x₁, y₁) to terminal point Q(x₂, y₂) is ⟨x₂ − x₁, y₂ − y₁⟩.',
        'Two nonzero vectors are orthogonal if and only if their dot product equals zero.',
        'For trigonometric parametrizations like x = a cos t, y = b sin t, use cos²t + sin²t = 1 to eliminate t.',
      ],
      example: {
        prompt: 'Find the dot product and angle between u = ⟨3, 4⟩ and v = ⟨−4, 3⟩.',
        steps: [
          'Compute dot product: u · v = (3)(−4) + (4)(3) = −12 + 12 = 0.',
          'Since u · v = 0 and both vectors are nonzero, cos θ = 0 ⇒ θ = 90°.',
        ],
        answer: 'u · v = 0; orthogonal (90°)',
      },
      practice: [
        {
          question: 'Find the unit vector in the direction of v = ⟨6, −8⟩.',
          options: ['⟨0.6, −0.8⟩', '⟨3, −4⟩', '⟨0.3, −0.4⟩', '⟨6/14, −8/14⟩'],
          correctIndex: 0,
          explanation: '||v|| = √(36 + 64) = 10, so unit vector = ⟨6/10, −8/10⟩ = ⟨0.6, −0.8⟩.',
        },
        {
          question: 'Eliminate parameter t from x = 2t + 1 and y = t² − 3.',
          options: ['y = ((x − 1)/2)² − 3', 'y = (2x + 1)² − 3', 'y = x²/2 − 3', 'x = 2y + 7'],
          correctIndex: 0,
          explanation: 'Solve for t: t = (x − 1)/2, then substitute into y = t² − 3.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'polar-coordinates-complex-plane',
      title: 'Polar Coordinates & Complex Plane (De Moivre)',
      summary:
        'Plot polar points (r, θ), convert between polar and rectangular coordinates/equations, and multiply or take powers of complex numbers in trigonometric form.',
      objectives: [
        'Convert (r, θ) ↔ (x, y) and r/θ equations ↔ x/y equations.',
        'Identify polar rose, limaçon, and circle symmetries.',
        'Apply De Moivre’s Theorem for powers of complex numbers.',
      ],
      formulas: [
        {
          label: 'Polar ↔ Rectangular',
          expression: 'x = r cos θ,  y = r sin θ   |   r² = x² + y²,  tan θ = y/x',
        },
        {
          label: 'Complex Polar Form & De Moivre',
          expression: 'z = r(cos θ + i sin θ)  ⇒  z^n = r^n(cos(nθ) + i sin(nθ))',
        },
      ],
      concepts: [
        'Always check which quadrant (x, y) lies in when computing θ from arctan(y/x); add π if x < 0.',
        'A polar rose r = a sin(nθ) or r = a cos(nθ) has n petals when n is odd and 2n petals when n is even.',
        'Multiplying two complex numbers in polar form multiplies their moduli and adds their arguments.',
      ],
      example: {
        prompt: 'Convert rectangular point (−2, 2√3) to polar coordinates (r > 0, 0 ≤ θ < 2π).',
        steps: [
          'Radius: r = √((−2)² + (2√3)²) = √(4 + 12) = √16 = 4.',
          'Reference angle: tan θ_ref = 2√3 / 2 = √3 ⇒ π/3.',
          'Point lies in QII (x < 0, y > 0), so θ = π − π/3 = 2π/3.',
        ],
        answer: '(4, 2π/3)',
      },
      practice: [
        {
          question: 'How many petals does the polar curve r = 5 cos(4θ) have?',
          options: ['4', '5', '8', '10'],
          correctIndex: 2,
          explanation: 'Because n = 4 is even, r = a cos(nθ) has 2n = 8 petals.',
        },
        {
          question: 'Convert r = 6 sin θ to rectangular form.',
          options: ['x² + y² = 6y', 'x² + y² = 6x', 'y = 6', 'x² − y² = 6y'],
          correctIndex: 0,
          explanation: 'Multiply both sides by r: r² = 6 r sin θ ⇒ x² + y² = 6y.',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'matrices-limits-preview',
      title: 'Matrices, Determinants & Limits Preview',
      summary:
        'Perform matrix multiplication and inverses, evaluate 2×2 determinants, and compute intuitive algebraic limits bridging Precalculus to Calculus.',
      objectives: [
        'Determine when matrix multiplication A · B is defined.',
        'Compute 2×2 determinants and matrix inverses.',
        'Evaluate basic finite limits and limits at infinity via factoring and rationalizing.',
      ],
      formulas: [
        {
          label: '2×2 Determinant & Inverse',
          expression: 'det([[a,b],[c,d]]) = ad − bc   |   A⁻¹ = 1/(ad−bc) · [[d,−b],[−c,a]]',
        },
        {
          label: 'Matrix Dimension Rule',
          expression: '(m × n) · (n × p) = (m × p)',
          note: 'Inner dimensions must match.',
        },
      ],
      concepts: [
        'Matrix multiplication is NOT commutative in general (AB ≠ BA).',
        'A square matrix has an inverse if and only if its determinant is nonzero.',
        'A limit lim(x→c) f(x) describes the value f(x) approaches near c, regardless of whether f(c) itself is defined.',
      ],
      example: {
        prompt: 'Find the inverse of A = [[4, 3], [5, 4]].',
        steps: [
          'Compute determinant: det(A) = (4)(4) − (3)(5) = 16 − 15 = 1.',
          'Swap diagonal entries and negate off-diagonals: [[4, −3], [−5, 4]].',
          'Divide by det(A) = 1.',
        ],
        answer: '[[4, −3], [−5, 4]]',
      },
      practice: [
        {
          question: 'If A is 3×2 and B is 2×4, what are the dimensions of product AB?',
          options: ['2×2', '3×4', '4×3', 'Undefined'],
          correctIndex: 1,
          explanation: 'Inner dimensions (2 and 2) match; outer dimensions give 3×4.',
        },
        {
          question: 'Evaluate lim (x → 3) of (x² − 9) / (x − 3).',
          options: ['0', '3', '6', 'Does not exist'],
          correctIndex: 2,
          explanation: 'Factor numerator: (x − 3)(x + 3)/(x − 3) = x + 3 for x ≠ 3. Approaching x = 3 yields 3 + 3 = 6.',
        },
      ],
    },
  ],
};
