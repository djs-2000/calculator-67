import { type MathCourse } from '../types';

export const algebra1Course: MathCourse = {
  slug: 'algebra-1',
  title: 'Algebra 1',
  level: 'Foundations · Grade 9',
  summary:
    'Linear equations, inequalities, slope and graphing, systems, exponent rules, polynomials, factoring, and quadratic functions.',
  pages: [
    {
      pageNumber: 1,
      slug: 'real-numbers-expressions',
      title: 'Real Numbers, Order of Operations & Expressions',
      summary:
        'Classify subsets of the real number system, apply PEMDAS accurately, and simplify algebraic expressions using the distributive property and like terms.',
      objectives: [
        'Distinguish natural, whole, integer, rational, and irrational numbers.',
        'Evaluate numerical expressions using grouping symbols, exponents, multiplication/division left-to-right, and addition/subtraction left-to-right.',
        'Combine like terms and distribute coefficients cleanly.',
      ],
      formulas: [
        {
          label: 'Distributive Property',
          expression: 'a(b + c) = ab + ac',
          note: 'Applies across addition and subtraction.',
        },
        {
          label: 'Commutative Property',
          expression: 'a + b = b + a   and   a · b = b · a',
        },
        {
          label: 'Associative Property',
          expression: '(a + b) + c = a + (b + c)',
        },
      ],
      concepts: [
        'Rational numbers can be written as a ratio p/q of integers with q ≠ 0; their decimal expansions terminate or repeat.',
        'Irrational numbers (such as √2, √5, π) have non-terminating, non-repeating decimal expansions.',
        'Multiplication and division share equal precedence and are evaluated strictly from left to right.',
        'Like terms must have identical variables raised to identical exponents before their coefficients can be added.',
      ],
      example: {
        prompt: 'Simplify 4(2x − 3) − 2(5x + 1) + 7.',
        steps: [
          'Distribute 4 across (2x − 3): 8x − 12.',
          'Distribute −2 across (5x + 1): −10x − 2.',
          'Combine the expanded parts with +7: (8x − 10x) + (−12 − 2 + 7).',
          'Simplify coefficients and constants: −2x − 7.',
        ],
        answer: '−2x − 7',
      },
      practice: [
        {
          question: 'Evaluate 18 ÷ 3 × 2 + 4² using order of operations.',
          options: ['19', '28', '22', '12'],
          correctIndex: 1,
          explanation: 'Exponent first: 4² = 16. Then left to right: 18 ÷ 3 = 6, 6 × 2 = 12, and 12 + 16 = 28.',
        },
        {
          question: 'Which number is irrational?',
          options: ['0.375', '−9/4', '√12', '√49'],
          correctIndex: 2,
          explanation: '12 is not a perfect square, so √12 = 2√3 cannot be written as an exact ratio of integers.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'linear-equations-inequalities',
      title: 'Multi-Step Linear Equations & Inequalities',
      summary:
        'Isolate variables using inverse operations, handle special solution cases, and solve compound and absolute-value inequalities.',
      objectives: [
        'Solve linear equations with variables on both sides and fractional coefficients.',
        'Identify equations with one solution, no solution, or infinitely many solutions.',
        'Reverse the inequality sign when multiplying or dividing by a negative value.',
      ],
      formulas: [
        {
          label: 'Multiplication Sign Flip',
          expression: 'If c < 0 and a < b, then ac > bc',
          note: 'Always flip inequality direction when multiplying or dividing by a negative.',
        },
        {
          label: 'Absolute Value Equation',
          expression: '|ax + b| = c  ⇒  ax + b = c  or  ax + b = −c  (c ≥ 0)',
        },
        {
          label: 'Absolute Value Inequalities',
          expression: '|u| < c ⇒ −c < u < c   |   |u| > c ⇒ u < −c or u > c',
        },
      ],
      concepts: [
        'Clear fractions first by multiplying every term on both sides by the least common denominator (LCD).',
        'If variables cancel and yield a true statement like 5 = 5, the equation is an identity with infinitely many solutions.',
        'If variables cancel and yield a false statement like 3 = 7, there is no solution.',
        'Graph < or > with an open circle, and ≤ or ≥ with a closed circle.',
      ],
      example: {
        prompt: 'Solve for x: 5 − 3(x − 2) ≥ 20.',
        steps: [
          'Distribute −3: 5 − 3x + 6 ≥ 20.',
          'Combine constants: 11 − 3x ≥ 20.',
          'Subtract 11 from both sides: −3x ≥ 9.',
          'Divide by −3 and flip the inequality sign: x ≤ −3.',
        ],
        answer: 'x ≤ −3',
      },
      practice: [
        {
          question: 'Solve 4(x + 2) = 4x − 5.',
          options: ['x = 0', 'x = −13/8', 'No solution', 'Infinitely many solutions'],
          correctIndex: 2,
          explanation: 'Expanding gives 4x + 8 = 4x − 5. Subtracting 4x gives 8 = −5, which is false, so there is no solution.',
        },
        {
          question: 'Which values satisfy |x − 4| ≤ 3?',
          options: ['1 ≤ x ≤ 7', 'x ≤ 1 or x ≥ 7', '−7 ≤ x ≤ 1', 'x ≤ 7'],
          correctIndex: 0,
          explanation: '−3 ≤ x − 4 ≤ 3. Adding 4 to all three parts yields 1 ≤ x ≤ 7.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'slope-linear-graphing',
      title: 'Rate of Change, Slope & Graphing Lines',
      summary:
        'Compute slope between coordinate points, interpret intercepts in context, and graph horizontal, vertical, and oblique lines.',
      objectives: [
        'Calculate slope m from two points, a table, or a graph.',
        'Find x- and y-intercepts algebraically.',
        'Distinguish zero slope (horizontal) from undefined slope (vertical).',
      ],
      formulas: [
        {
          label: 'Slope Formula',
          expression: 'm = (y₂ − y₁) / (x₂ − x₁)',
          note: 'Vertical change (rise) over horizontal change (run).',
        },
        {
          label: 'Horizontal & Vertical Lines',
          expression: 'y = c (slope m = 0)   |   x = c (slope undefined)',
        },
        {
          label: 'Intercepts',
          expression: 'x-intercept: set y = 0   |   y-intercept: set x = 0',
        },
      ],
      concepts: [
        'A positive slope rises from left to right; a negative slope falls from left to right.',
        'Always subtract coordinates in a consistent order: if numerator is y₂ − y₁, denominator must be x₂ − x₁.',
        'In word problems, slope represents the unit rate of change and the y-intercept represents the starting value at x = 0.',
      ],
      example: {
        prompt: 'Find the slope and intercepts of the line passing through (−2, 5) and (4, −7).',
        steps: [
          'Apply the slope formula: m = (−7 − 5) / (4 − (−2)) = −12 / 6 = −2.',
          'Use point-slope with (4, −7): y − (−7) = −2(x − 4) ⇒ y + 7 = −2x + 8 ⇒ y = −2x + 1.',
          'Set x = 0 for the y-intercept: (0, 1).',
          'Set y = 0 for the x-intercept: 0 = −2x + 1 ⇒ x = 0.5, so (0.5, 0).',
        ],
        answer: 'm = −2, y-intercept (0, 1), x-intercept (0.5, 0)',
      },
      practice: [
        {
          question: 'What is the slope of the line passing through (3, −4) and (3, 9)?',
          options: ['0', '13', 'Undefined', '−13/6'],
          correctIndex: 2,
          explanation: 'The x-coordinates are equal (3 − 3 = 0). Division by zero means the vertical line has an undefined slope.',
        },
        {
          question: 'Find the x-intercept of 3x − 5y = 30.',
          options: ['(0, −6)', '(10, 0)', '(−6, 0)', '(0, 10)'],
          correctIndex: 1,
          explanation: 'Substitute y = 0: 3x = 30, so x = 10. The x-intercept is (10, 0).',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'writing-linear-equations',
      title: 'Linear Forms, Parallel & Perpendicular Lines',
      summary:
        'Convert seamlessly between slope-intercept, point-slope, and standard forms, and determine equations of parallel and perpendicular lines.',
      objectives: [
        'Write equations in slope-intercept, point-slope, and standard form.',
        'Identify parallel lines (equal slopes) and perpendicular lines (opposite reciprocal slopes).',
        'Model real-world linear relationships given rate and point data.',
      ],
      formulas: [
        {
          label: 'Slope-Intercept Form',
          expression: 'y = mx + b',
          note: 'm is slope; b is y-intercept.',
        },
        {
          label: 'Point-Slope Form',
          expression: 'y − y₁ = m(x − x₁)',
        },
        {
          label: 'Standard Form',
          expression: 'Ax + By = C   (A, B, C integers, A ≥ 0)',
        },
        {
          label: 'Perpendicular Slopes',
          expression: 'm₁ · m₂ = −1   ⇒   m₂ = −1 / m₁',
        },
      ],
      concepts: [
        'Parallel lines in the same plane have identical slopes and different y-intercepts.',
        'Perpendicular non-vertical lines have slopes that are negative reciprocals (flip the fraction and change the sign).',
        'Point-slope form is the fastest starting template whenever you know a slope and any single point.',
      ],
      example: {
        prompt: 'Write the slope-intercept equation of the line perpendicular to y = (2/3)x − 4 passing through (6, −1).',
        steps: [
          'Identify the given slope: m₁ = 2/3.',
          'Take the negative reciprocal for the perpendicular slope: m₂ = −3/2.',
          'Substitute into point-slope form: y − (−1) = (−3/2)(x − 6).',
          'Simplify: y + 1 = (−3/2)x + 9 ⇒ y = (−3/2)x + 8.',
        ],
        answer: 'y = (−3/2)x + 8',
      },
      practice: [
        {
          question: 'Which line is parallel to 2x + y = 7?',
          options: ['y = 2x + 1', 'y = −2x + 5', 'y = (1/2)x − 3', 'y = −(1/2)x + 7'],
          correctIndex: 1,
          explanation: 'Rewriting 2x + y = 7 gives y = −2x + 7, which has slope −2. Only y = −2x + 5 shares slope −2.',
        },
        {
          question: 'Convert y − 3 = 4(x + 2) to standard form Ax + By = C.',
          options: ['4x − y = −11', '4x + y = 11', '4x − y = 5', 'x − 4y = −11'],
          correctIndex: 0,
          explanation: 'y − 3 = 4x + 8 ⇒ −11 = 4x − y, so 4x − y = −11.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'systems-linear-equations',
      title: 'Systems of Linear Equations & Inequalities',
      summary:
        'Solve two-variable linear systems by graphing, substitution, and elimination, and interpret overlapping half-planes for systems of inequalities.',
      objectives: [
        'Choose efficiently between substitution and elimination.',
        'Recognize inconsistent (parallel) and dependent (coincident) systems.',
        'Determine solution regions for systems of linear inequalities.',
      ],
      formulas: [
        {
          label: 'Consistent Independent',
          expression: 'm₁ ≠ m₂  ⇒  Exactly 1 intersection point (x, y)',
        },
        {
          label: 'Inconsistent System',
          expression: 'm₁ = m₂  and  b₁ ≠ b₂  ⇒  No solution (parallel)',
        },
        {
          label: 'Dependent System',
          expression: 'm₁ = m₂  and  b₁ = b₂  ⇒  Infinitely many solutions',
        },
      ],
      concepts: [
        'Use substitution when one equation already has an isolated variable (e.g., y = 3x − 2).',
        'Use elimination when both equations are in standard form Ax + By = C.',
        'For linear inequalities, use a dashed boundary line for < or > and a solid line for ≤ or ≥, then test (0, 0) to shade the true half-plane.',
      ],
      example: {
        prompt: 'Solve the system by elimination: 3x + 2y = 16 and 5x − 4y = 12.',
        steps: [
          'Multiply the first equation by 2 so y-coefficients become opposites: 6x + 4y = 32.',
          'Add to the second equation: (6x + 5x) + (4y − 4y) = 32 + 12 ⇒ 11x = 44.',
          'Divide by 11: x = 4.',
          'Substitute x = 4 into 3x + 2y = 16: 12 + 2y = 16 ⇒ 2y = 4 ⇒ y = 2.',
        ],
        answer: '(4, 2)',
      },
      practice: [
        {
          question: 'Solve the system: y = 2x − 1 and 3x + y = 14.',
          options: ['(3, 5)', '(5, 3)', '(2, 3)', '(4, 7)'],
          correctIndex: 0,
          explanation: 'Substitute y = 2x − 1 into 3x + (2x − 1) = 14 ⇒ 5x = 15 ⇒ x = 3, and y = 2(3) − 1 = 5.',
        },
        {
          question: 'How many solutions does the system 2x − 6y = 8 and x − 3y = 10 have?',
          options: ['Exactly one', 'Two', 'None', 'Infinitely many'],
          correctIndex: 2,
          explanation: 'Multiplying x − 3y = 10 by 2 yields 2x − 6y = 20, which contradicts 2x − 6y = 8. The lines are parallel.',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'exponents-exponential-functions',
      title: 'Exponent Laws & Exponential Functions',
      summary:
        'Apply integer exponent properties, write numbers in scientific notation, and model exponential growth and decay.',
      objectives: [
        'Simplify expressions with product, quotient, power, zero, and negative exponent rules.',
        'Distinguish linear (constant difference) vs. exponential (constant ratio) patterns.',
        'Build growth and decay models y = a(1 ± r)^t.',
      ],
      formulas: [
        {
          label: 'Product & Quotient Rules',
          expression: 'a^m · a^n = a^(m+n)   |   a^m / a^n = a^(m−n)',
        },
        {
          label: 'Power & Negative Rules',
          expression: '(a^m)^n = a^(mn)   |   a^(−n) = 1 / a^n   |   a^0 = 1 (a ≠ 0)',
        },
        {
          label: 'Exponential Growth / Decay',
          expression: 'y = a(1 + r)^t (growth)   |   y = a(1 − r)^t (decay)',
          note: 'a is initial value, r is rate per period, t is time periods.',
        },
      ],
      concepts: [
        'Exponents only apply to the base immediately beneath them: −3² = −9, whereas (−3)² = 9.',
        'A negative exponent indicates a reciprocal, never a negative result.',
        'In y = a · b^x, if b > 1 the function models exponential growth; if 0 < b < 1 it models exponential decay.',
      ],
      example: {
        prompt: 'Simplify (3x⁴y⁻²)² / (9x³y), expressing all exponents positively.',
        steps: [
          'Apply the outer power of 2 to every factor in the numerator: 3² · (x⁴)² · (y⁻²)² = 9x⁸y⁻⁴.',
          'Divide coefficients: 9 / 9 = 1.',
          'Subtract exponents for common bases: x^(8−3) = x⁵ and y^(−4−1) = y⁻⁵.',
          'Move the negative exponent to the denominator: x⁵ / y⁵.',
        ],
        answer: 'x⁵ / y⁵',
      },
      practice: [
        {
          question: 'A lab culture starts with 200 cells and increases by 15% each hour. Which model gives the count after t hours?',
          options: ['200(0.15)^t', '200(1.15)^t', '200 + 1.15t', '200(0.85)^t'],
          correctIndex: 1,
          explanation: 'Growth factor is 1 + r = 1 + 0.15 = 1.15, giving y = 200(1.15)^t.',
        },
        {
          question: 'Simplify (2a⁻³b²)³.',
          options: ['6b⁶ / a⁹', '8b⁶ / a⁹', '8b⁵ / a⁶', '2b⁶ / a⁹'],
          correctIndex: 1,
          explanation: '2³ = 8, (a⁻³)³ = a⁻⁹ = 1/a⁹, and (b²)³ = b⁶.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'polynomial-operations',
      title: 'Polynomial Classification & Operations',
      summary:
        'Write polynomials in standard descending order and perform addition, subtraction, and multiplication including special binomial products.',
      objectives: [
        'Determine polynomial degree and leading coefficient in standard form.',
        'Subtract polynomials accurately by distributing the negative sign.',
        'Multiply binomials and trinomials using area models or FOIL.',
      ],
      formulas: [
        {
          label: 'Square of a Sum / Difference',
          expression: '(a + b)² = a² + 2ab + b²   |   (a − b)² = a² − 2ab + b²',
          note: 'Do not forget the middle 2ab term.',
        },
        {
          label: 'Product of Conjugates',
          expression: '(a + b)(a − b) = a² − b²',
        },
      ],
      concepts: [
        'Standard form orders terms from highest exponent to lowest exponent.',
        'Degree of a single-variable polynomial equals its largest exponent.',
        'When subtracting (A) − (B), negate every single term inside B before combining like terms.',
      ],
      example: {
        prompt: 'Expand and simplify (2x − 5)² − (x² − 3x + 4).',
        steps: [
          'Use (a − b)² = a² − 2ab + b²: (2x − 5)² = 4x² − 20x + 25.',
          'Distribute the minus sign across the second polynomial: −x² + 3x − 4.',
          'Combine like terms: (4x² − x²) + (−20x + 3x) + (25 − 4).',
          'Result: 3x² − 17x + 21.',
        ],
        answer: '3x² − 17x + 21',
      },
      practice: [
        {
          question: 'What is the product of (3x − 4) and (3x + 4)?',
          options: ['9x² − 16', '9x² + 16', '9x² − 24x + 16', '6x² − 16'],
          correctIndex: 0,
          explanation: 'Conjugates multiply as a² − b² = (3x)² − 4² = 9x² − 16.',
        },
        {
          question: 'What is the degree of 7x − 4x⁵ + 2x³ + 9?',
          options: ['7', '5', '4', '9'],
          correctIndex: 1,
          explanation: 'The highest exponent of x is 5 (from −4x⁵), so the degree is 5.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'factoring-polynomials',
      title: 'Factoring Polynomials Completely',
      summary:
        'Factor out greatest common factors, factor quadratics with leading coefficient 1 and a ≠ 1, recognize difference of squares, and factor by grouping.',
      objectives: [
        'Always extract the GCF first before applying any other factoring pattern.',
        'Factor trinomials ax² + bx + c using sum-product or ac-splitting.',
        'Recognize difference of two squares and perfect-square trinomials.',
      ],
      formulas: [
        {
          label: 'Difference of Squares',
          expression: 'a² − b² = (a + b)(a − b)',
        },
        {
          label: 'Perfect Square Trinomials',
          expression: 'a² ± 2ab + b² = (a ± b)²',
        },
        {
          label: 'ac-Method for ax² + bx + c',
          expression: 'Find m, n with m · n = a · c  and  m + n = b',
        },
      ],
      concepts: [
        'Sum of squares a² + b² with no common factor is prime over the real numbers.',
        'Check every resulting factor to confirm it cannot be factored further (complete factorization).',
        'For four-term polynomials, group the first two and last two terms and look for a matching binomial factor.',
      ],
      example: {
        prompt: 'Factor completely: 3x³ − 12x.',
        steps: [
          'Factor out the GCF of 3x: 3x(x² − 4).',
          'Recognize x² − 4 as a difference of squares: x² − 2².',
          'Factor into conjugates: 3x(x + 2)(x − 2).',
        ],
        answer: '3x(x + 2)(x − 2)',
      },
      practice: [
        {
          question: 'Factor 2x² + 7x + 3 completely.',
          options: ['(2x + 3)(x + 1)', '(2x + 1)(x + 3)', '(x + 6)(2x + 1)', '(2x − 1)(x − 3)'],
          correctIndex: 1,
          explanation: 'Expand (2x + 1)(x + 3) = 2x² + 6x + x + 3 = 2x² + 7x + 3.',
        },
        {
          question: 'Factor x² − 11x + 28.',
          options: ['(x − 4)(x − 7)', '(x + 4)(x − 7)', '(x − 2)(x − 14)', '(x + 4)(x + 7)'],
          correctIndex: 0,
          explanation: '−4 and −7 multiply to +28 and add to −11.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'quadratic-equations-parabolas',
      title: 'Quadratic Equations & Parabolas',
      summary:
        'Graph parabolas using axis of symmetry and vertex, and solve quadratic equations via factoring, square roots, completing the square, and the quadratic formula.',
      objectives: [
        'Find the vertex, axis of symmetry, and direction of opening for y = ax² + bx + c.',
        'Apply the zero-product property when factored.',
        'Use the quadratic formula and discriminant to find real roots.',
      ],
      formulas: [
        {
          label: 'Axis of Symmetry & Vertex',
          expression: 'x = −b / (2a)   |   Vertex = (−b/(2a), f(−b/(2a)))',
        },
        {
          label: 'Quadratic Formula',
          expression: 'x = (−b ± √(b² − 4ac)) / (2a)',
        },
        {
          label: 'Discriminant Δ = b² − 4ac',
          expression: 'Δ > 0: 2 real roots | Δ = 0: 1 real root | Δ < 0: 0 real roots',
        },
      ],
      concepts: [
        'If a > 0 the parabola opens upward with a minimum at the vertex; if a < 0 it opens downward with a maximum.',
        'To complete the square on x² + bx, add (b/2)² to create (x + b/2)².',
        'Always rewrite a quadratic equation into standard form ax² + bx + c = 0 before applying the zero-product property or quadratic formula.',
      ],
      example: {
        prompt: 'Solve 2x² − 4x − 6 = 0 using the quadratic formula (or factoring).',
        steps: [
          'Divide both sides by 2: x² − 2x − 3 = 0.',
          'Factor the trinomial: (x − 3)(x + 1) = 0.',
          'Apply the zero-product property: x − 3 = 0 or x + 1 = 0.',
          'Solutions: x = 3 or x = −1.',
        ],
        answer: 'x = 3 or x = −1',
      },
      practice: [
        {
          question: 'Find the vertex of y = x² − 6x + 5.',
          options: ['(3, −4)', '(−3, 32)', '(3, 4)', '(6, 5)'],
          correctIndex: 0,
          explanation: 'x = −(−6)/(2·1) = 3. Plugging in x = 3 gives y = 9 − 18 + 5 = −4, so vertex is (3, −4).',
        },
        {
          question: 'How many real solutions does 3x² + 2x + 5 = 0 have?',
          options: ['2 real solutions', '1 real solution', '0 real solutions', 'Infinitely many'],
          correctIndex: 2,
          explanation: 'Discriminant Δ = 2² − 4(3)(5) = 4 − 60 = −56 < 0, so there are 0 real solutions.',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'radicals-data-analysis',
      title: 'Radicals, Functions & Data Analysis',
      summary:
        'Simplify square roots, verify function rules via domain and range, and interpret linear regression, residuals, and two-way frequency tables.',
      objectives: [
        'Simplify radical expressions by factoring out largest perfect squares.',
        'Determine domain, range, and whether a relation is a function.',
        'Interpret slope, y-intercept, and correlation coefficient r in scatterplots.',
      ],
      formulas: [
        {
          label: 'Product Rule for Radicals',
          expression: '√(ab) = √a · √b   (a ≥ 0, b ≥ 0)',
        },
        {
          label: 'Residual Formula',
          expression: 'Residual = Actual y − Predicted ŷ',
        },
        {
          label: 'Average Rate of Change',
          expression: '(f(b) − f(a)) / (b − a)',
        },
      ],
      concepts: [
        'A relation is a function if every input x in the domain pairs with exactly one output y in the range (Vertical Line Test).',
        'A correlation coefficient r near +1 or −1 indicates a strong linear association; r alone never proves causation.',
        'When solving radical equations like √(x + 3) = x − 3, always substitute answers back into the original equation to rule out extraneous roots.',
      ],
      example: {
        prompt: 'Simplify 3√48 + 2√12.',
        steps: [
          'Factor largest perfect squares inside each radical: √48 = √(16·3) = 4√3 and √12 = √(4·3) = 2√3.',
          'Multiply by outer coefficients: 3(4√3) + 2(2√3) = 12√3 + 4√3.',
          'Combine like radicals: 16√3.',
        ],
        answer: '16√3',
      },
      practice: [
        {
          question: 'A line of best fit predicts ŷ = 78 when actual score is y = 83. What is the residual?',
          options: ['−5', '5', '161', '0.94'],
          correctIndex: 1,
          explanation: 'Residual = Actual − Predicted = 83 − 78 = +5.',
        },
        {
          question: 'Simplify √(50x⁴) for x ≥ 0.',
          options: ['5x²√2', '25x²√2', '5x√2', '10x²√5'],
          correctIndex: 0,
          explanation: '√(50x⁴) = √(25 · 2 · (x²)²) = 5x²√2.',
        },
      ],
    },
  ],
};
