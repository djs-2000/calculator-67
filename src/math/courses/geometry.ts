import { type MathCourse } from '../types';

export const geometryCourse: MathCourse = {
  slug: 'geometry',
  title: 'Geometry',
  level: 'Euclidean · Grade 10',
  summary:
    'Coordinate foundations, deductive proofs, parallel lines, triangle congruence and similarity, right-triangle trigonometry, circles, and 3D solids.',
  pages: [
    {
      pageNumber: 1,
      slug: 'foundations-angles',
      title: 'Points, Lines, Midpoint, Distance & Angle Pairs',
      summary:
        'Apply the segment addition postulate, compute distance and midpoint in the coordinate plane, and solve equations involving complementary, supplementary, and vertical angles.',
      objectives: [
        'Use the midpoint and distance formulas for any two coordinate points.',
        'Classify acute, right, obtuse, complementary, supplementary, and vertical angles.',
        'Solve algebraic equations using angle addition and linear pairs.',
      ],
      formulas: [
        {
          label: 'Distance Formula',
          expression: 'd = √((x₂ − x₁)² + (y₂ − y₁)²)',
        },
        {
          label: 'Midpoint Formula',
          expression: 'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
        },
        {
          label: 'Angle Relationships',
          expression: 'Complementary: α + β = 90°  |  Supplementary: α + β = 180°',
        },
      ],
      concepts: [
        'Vertical angles formed by two intersecting lines are always congruent.',
        'A linear pair consists of two adjacent angles whose non-common sides form a straight line, so their measures sum to 180°.',
        'To find an endpoint given one endpoint and the midpoint, double the midpoint coordinates and subtract the known endpoint.',
      ],
      example: {
        prompt: 'Point M(3, −1) is the midpoint of segment AB. If A is (−2, 5), find B.',
        steps: [
          'Set up midpoint equations: (−2 + x)/2 = 3 and (5 + y)/2 = −1.',
          'Solve for x: −2 + x = 6 ⇒ x = 8.',
          'Solve for y: 5 + y = −2 ⇒ y = −7.',
        ],
        answer: 'B(8, −7)',
      },
      practice: [
        {
          question: 'Find the distance between (−1, 2) and (5, 10).',
          options: ['8', '10', '14', '√52'],
          correctIndex: 1,
          explanation: 'd = √((5 − (−1))² + (10 − 2)²) = √(6² + 8²) = √(36 + 64) = √100 = 10.',
        },
        {
          question: 'Two angles form a linear pair and measure (3x + 10)° and (2x + 20)°. Find x.',
          options: ['12', '30', '20', '36'],
          correctIndex: 1,
          explanation: 'Linear pairs sum to 180°: 5x + 30 = 180 ⇒ 5x = 150 ⇒ x = 30.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'reasoning-proofs',
      title: 'Logical Reasoning & Two-Column Proofs',
      summary:
        'Write converses, inverses, and contrapositives of conditional statements, and structure algebraic and geometric two-column proofs.',
      objectives: [
        'Identify hypothesis and conclusion in conditional statements (p → q).',
        'Know that a conditional statement and its contrapositive share the same truth value.',
        'Apply Reflexive, Symmetric, and Transitive properties of equality and congruence.',
      ],
      formulas: [
        {
          label: 'Conditional & Contrapositive',
          expression: 'Conditional: p → q   |   Contrapositive: ¬q → ¬p',
          note: 'Logically equivalent.',
        },
        {
          label: 'Converse & Inverse',
          expression: 'Converse: q → p   |   Inverse: ¬p → ¬q',
        },
      ],
      concepts: [
        'Inductive reasoning forms conjectures from observed patterns; a single counterexample disproves a conjecture.',
        'Deductive reasoning uses laws of logic (Law of Detachment and Law of Syllogism) to prove conclusions.',
        'Reflexive property (AB ≅ AB) is frequently used when two triangles share a common side or angle.',
      ],
      example: {
        prompt: 'State the contrapositive of: "If a triangle is equilateral, then it is isosceles."',
        steps: [
          'Identify p = "a triangle is equilateral" and q = "it is isosceles".',
          'Negate and swap to form ¬q → ¬p.',
          'Result: "If a triangle is not isosceles, then it is not equilateral."',
        ],
        answer: 'If a triangle is not isosceles, then it is not equilateral.',
      },
      practice: [
        {
          question: 'Which statement is always logically equivalent to "If p, then q"?',
          options: ['If q, then p', 'If not p, then not q', 'If not q, then not p', 'p and not q'],
          correctIndex: 2,
          explanation: 'A conditional statement and its contrapositive (¬q → ¬p) always share the exact same truth value.',
        },
        {
          question: 'Which property justifies stating ∠A ≅ ∠A?',
          options: ['Symmetric', 'Transitive', 'Reflexive', 'Substitution'],
          correctIndex: 2,
          explanation: 'Any geometric figure or number equals/is congruent to itself by the Reflexive Property.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'parallel-lines-transversals',
      title: 'Parallel Lines, Transversals & Slopes',
      summary:
        'Determine angle relationships created when a transversal cuts parallel lines and prove lines parallel using angle converses and coordinate slopes.',
      objectives: [
        'Classify corresponding, alternate interior, alternate exterior, and consecutive interior angles.',
        'Solve for unknown angles when two lines are parallel.',
        'Prove lines parallel or perpendicular using coordinate slopes.',
      ],
      formulas: [
        {
          label: 'Parallel Lines Cut by a Transversal',
          expression: 'Corresponding, Alt. Interior, Alt. Exterior: Congruent',
          note: 'Consecutive (same-side) interior angles are supplementary (sum = 180°).',
        },
        {
          label: 'Coordinate Slope Tests',
          expression: 'Parallel: m₁ = m₂   |   Perpendicular: m₁ · m₂ = −1',
        },
      ],
      concepts: [
        'Never assume lines are parallel from appearance alone; require parallel arrow markings, given statements, or angle congruences.',
        'Consecutive interior angles lie between the two lines on the same side of the transversal and add to 180°.',
        'If two lines in a plane are both perpendicular to the same line, they are parallel to each other.',
      ],
      example: {
        prompt: 'Parallel lines l and m are cut by a transversal. Same-side interior angles measure (4x + 12)° and (2x + 18)°. Find each angle.',
        steps: [
          'Same-side interior angles are supplementary: (4x + 12) + (2x + 18) = 180.',
          'Combine terms: 6x + 30 = 180 ⇒ 6x = 150 ⇒ x = 25.',
          'Compute angles: 4(25) + 12 = 112° and 2(25) + 18 = 68°.',
        ],
        answer: '112° and 68°',
      },
      practice: [
        {
          question: 'If alternate interior angles formed by parallel lines measure 5x − 15 and 3x + 21, find x.',
          options: ['18', '9', '12', '21.75'],
          correctIndex: 0,
          explanation: 'Alternate interior angles are congruent: 5x − 15 = 3x + 21 ⇒ 2x = 36 ⇒ x = 18.',
        },
        {
          question: 'Line p passes through (1, 2) and (4, 8). What is the slope of a line perpendicular to p?',
          options: ['2', '−2', '1/2', '−1/2'],
          correctIndex: 3,
          explanation: 'Slope of p is (8 − 2)/(4 − 1) = 6/3 = 2. Negative reciprocal is −1/2.',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'triangle-congruence',
      title: 'Triangle Theorems & Congruence Criteria',
      summary:
        'Apply Triangle Sum and Exterior Angle Theorems, and prove triangles congruent using SSS, SAS, ASA, AAS, and HL along with CPCTC.',
      objectives: [
        'Solve for interior and exterior angles of triangles.',
        'Choose valid triangle congruence postulates and reject invalid ones (SSA, AAA).',
        'Use CPCTC after proving triangle congruence.',
      ],
      formulas: [
        {
          label: 'Triangle Angle Sum',
          expression: 'm∠A + m∠B + m∠C = 180°',
        },
        {
          label: 'Exterior Angle Theorem',
          expression: 'm∠ext = m∠remote₁ + m∠remote₂',
        },
        {
          label: 'Valid Congruence Criteria',
          expression: 'SSS, SAS, ASA, AAS, and HL (right triangles only)',
        },
      ],
      concepts: [
        'In SAS, the congruent angle must sit strictly between the two pairs of congruent sides.',
        'AAA proves similarity, not congruence; SSA does not guarantee congruence except in right triangles (HL).',
        'Base angles opposite congruent sides in an isosceles triangle are congruent.',
      ],
      example: {
        prompt: 'In an isosceles triangle, the vertex angle is 44°. Find each base angle.',
        steps: [
          'Base angles in an isosceles triangle are equal; let each be x.',
          'Set up the Triangle Sum equation: 44 + x + x = 180.',
          'Solve: 2x = 136 ⇒ x = 68°.',
        ],
        answer: '68° each',
      },
      practice: [
        {
          question: 'Which pair is NOT a valid criterion to prove two triangles congruent?',
          options: ['ASA', 'AAS', 'SSA', 'HL'],
          correctIndex: 2,
          explanation: 'SSA (side-side-angle) can produce two different triangles (ambiguous case) unless the angle is 90° (HL).',
        },
        {
          question: 'An exterior angle of a triangle is 125°, and one non-adjacent interior angle is 48°. Find the other remote interior angle.',
          options: ['55°', '77°', '132°', '67°'],
          correctIndex: 1,
          explanation: 'By the Exterior Angle Theorem, 125 = 48 + x ⇒ x = 77°.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'similarity-proportions',
      title: 'Ratios, Similarity & Dilations',
      summary:
        'Prove triangles similar using AA, SAS, and SSS similarity, apply triangle proportionality, and compute perimeters and areas under dilations.',
      objectives: [
        'Verify triangle similarity with AA~, SAS~, and SSS~.',
        'Solve missing lengths using proportional corresponding sides.',
        'Scale lengths by k and areas by k² under a dilation of scale factor k.',
      ],
      formulas: [
        {
          label: 'Similarity Ratio (Scale Factor k)',
          expression: 'Side_new / Side_old = k   |   Perimeter ratio = k   |   Area ratio = k²',
        },
        {
          label: 'Triangle Proportionality',
          expression: 'Line parallel to 1 side divides the other 2 sides proportionally',
        },
      ],
      concepts: [
        'If two angles of one triangle are congruent to two angles of another, the triangles are similar by AA~.',
        'Order of vertices in a similarity statement (△ABC ~ △DEF) dictates which sides correspond in proportions.',
        'A dilation centered at the origin multiplies every coordinate (x, y) by the scale factor k: (kx, ky).',
      ],
      example: {
        prompt: '△ABC ~ △DEF with scale factor 3:5. If the area of △ABC is 36 cm², find the area of △DEF.',
        steps: [
          'Length ratio is k = 5/3 from △ABC to △DEF.',
          'Area scales by the square of the length ratio: (5/3)² = 25/9.',
          'Multiply: 36 × (25/9) = 4 × 25 = 100 cm².',
        ],
        answer: '100 cm²',
      },
      practice: [
        {
          question: 'A 6-ft pole casts a 4-ft shadow at the same moment a building casts a 28-ft shadow. How tall is the building?',
          options: ['18.7 ft', '42 ft', '36 ft', '48 ft'],
          correctIndex: 1,
          explanation: 'h / 28 = 6 / 4 ⇒ 4h = 168 ⇒ h = 42 ft.',
        },
        {
          question: 'Point P(−4, 6) is dilated from the origin by scale factor k = 1.5. Find P′.',
          options: ['(−6, 9)', '(−2.5, 7.5)', '(−8, 12)', '(−6, 4)'],
          correctIndex: 0,
          explanation: 'Multiply both coordinates by 1.5: (−4 · 1.5, 6 · 1.5) = (−6, 9).',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'right-triangles-pythagorean',
      title: 'Pythagorean Theorem, Converse & Geometric Mean',
      summary:
        'Find unknown legs or hypotenuses in right triangles, classify acute/right/obtuse triangles using the Pythagorean Converse, and apply altitude geometric mean relationships.',
      objectives: [
        'Solve right-triangle side lengths using a² + b² = c².',
        'Recognize common Pythagorean triples (3-4-5, 5-12-13, 8-15-17, 7-24-25).',
        'Classify triangles as acute, right, or obtuse from three side lengths.',
      ],
      formulas: [
        {
          label: 'Pythagorean Theorem',
          expression: 'a² + b² = c²   (c = longest side / hypotenuse)',
        },
        {
          label: 'Pythagorean Converse Classification',
          expression: 'c² = a²+b² (Right) | c² < a²+b² (Acute) | c² > a²+b² (Obtuse)',
        },
        {
          label: 'Altitude to Hypotenuse',
          expression: 'h² = p · q   (Geometric Mean of hypotenuse segments p, q)',
        },
      ],
      concepts: [
        'First verify three sides can form a triangle using the Triangle Inequality: a + b > c.',
        'Always assign c to the longest of the three sides before testing a² + b² against c².',
        'An altitude drawn to the hypotenuse of a right triangle creates two smaller triangles similar to the original and to each other.',
      ],
      example: {
        prompt: 'Classify a triangle with side lengths 7, 9, and 12.',
        steps: [
          'Check Triangle Inequality: 7 + 9 = 16 > 12 (valid triangle).',
          'Compare c² to a² + b²: 12² = 144 and 7² + 9² = 49 + 81 = 130.',
          'Since 144 > 130 (c² > a² + b²), the triangle is obtuse.',
        ],
        answer: 'Obtuse triangle',
      },
      practice: [
        {
          question: 'A right triangle has hypotenuse 25 and one leg 7. What is the other leg?',
          options: ['18', '24', '20', '√674'],
          correctIndex: 1,
          explanation: '7² + b² = 25² ⇒ 49 + b² = 625 ⇒ b² = 576 ⇒ b = 24.',
        },
        {
          question: 'Which side lengths form an acute triangle?',
          options: ['5, 12, 13', '6, 8, 11', '8, 10, 12', '4, 7, 12'],
          correctIndex: 2,
          explanation: 'For 8, 10, 12: 12² = 144 and 8² + 10² = 164. Since 144 < 164, it is acute.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'special-right-triangles-trig',
      title: 'Special Right Triangles & Basic Trigonometry',
      summary:
        'Use exact 45-45-90 and 30-60-90 ratios and apply sine, cosine, tangent, and inverse trig functions to find missing sides and angles.',
      objectives: [
        'Solve 45-45-90 and 30-60-90 triangles in exact radical form.',
        'Set up SOH-CAH-TOA ratios relative to an acute reference angle.',
        'Use inverse trig (sin⁻¹, cos⁻¹, tan⁻¹) to determine acute angles.',
      ],
      formulas: [
        {
          label: '45-45-90 Ratios',
          expression: 'Legs: x, x   |   Hypotenuse: x√2',
        },
        {
          label: '30-60-90 Ratios',
          expression: 'Short leg: x  |  Long leg: x√3  |  Hypotenuse: 2x',
        },
        {
          label: 'SOH-CAH-TOA',
          expression: 'sin θ = Opp/Hyp  |  cos θ = Adj/Hyp  |  tan θ = Opp/Adj',
        },
      ],
      concepts: [
        'In a 30-60-90 triangle, the short leg is always opposite the 30° angle and equals half the hypotenuse.',
        'Check your calculator is in Degree mode when working with geometric angle measures in degrees.',
        'Angles of elevation and depression are always measured from a horizontal line of sight.',
      ],
      example: {
        prompt: 'A 30-60-90 triangle has hypotenuse 14. Find the exact lengths of both legs.',
        steps: [
          'Hypotenuse = 2x = 14, so short leg x = 7.',
          'Long leg = x√3 = 7√3.',
        ],
        answer: 'Short leg = 7, Long leg = 7√3',
      },
      practice: [
        {
          question: 'A square has side length 9. What is the exact length of its diagonal?',
          options: ['9', '9√2', '9√3', '18'],
          correctIndex: 1,
          explanation: 'A square’s diagonal forms a 45-45-90 triangle with legs 9, so hypotenuse = 9√2.',
        },
        {
          question: 'In a right triangle, the side opposite angle θ is 5 and the adjacent side is 12. What is sin θ?',
          options: ['5/12', '12/13', '5/13', '13/5'],
          correctIndex: 2,
          explanation: 'Hypotenuse is √(5² + 12²) = 13, so sin θ = Opp/Hyp = 5/13.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'quadrilaterals-polygons',
      title: 'Polygons & Special Quadrilaterals',
      summary:
        'Compute interior and exterior angle sums of convex polygons and apply defining properties of parallelograms, rectangles, rhombi, squares, trapezoids, and kites.',
      objectives: [
        'Calculate interior and exterior angle sums for an n-gon.',
        'Apply side, angle, and diagonal theorems of special quadrilaterals.',
        'Solve trapezoid midsegment problems.',
      ],
      formulas: [
        {
          label: 'Polygon Interior Angle Sum',
          expression: 'S = (n − 2) · 180°   |   Each regular angle = (n − 2)·180° / n',
        },
        {
          label: 'Polygon Exterior Angle Sum',
          expression: 'Sum = 360° (for any convex n-gon)',
        },
        {
          label: 'Trapezoid Midsegment',
          expression: 'm = (b₁ + b₂) / 2',
        },
      ],
      concepts: [
        'In every parallelogram: opposite sides are parallel and congruent, opposite angles are congruent, consecutive angles are supplementary, and diagonals bisect each other.',
        'Rectangles add congruent diagonals and four 90° angles; rhombi add four congruent sides and perpendicular diagonals that bisect angles.',
        'A square satisfies all properties of parallelograms, rectangles, and rhombi simultaneously.',
      ],
      example: {
        prompt: 'Find the measure of one interior angle and one exterior angle of a regular decagon (10 sides).',
        steps: [
          'Exterior angle = 360° / 10 = 36°.',
          'Interior angle = 180° − 36° = 144° (or (10 − 2)·180° / 10 = 144°).',
        ],
        answer: 'Interior = 144°, Exterior = 36°',
      },
      practice: [
        {
          question: 'What is the sum of interior angles of a convex octagon (8 sides)?',
          options: ['720°', '900°', '1080°', '1440°'],
          correctIndex: 2,
          explanation: '(8 − 2) × 180° = 6 × 180° = 1080°.',
        },
        {
          question: 'Which quadrilateral always has perpendicular diagonals?',
          options: ['Rectangle', 'Parallelogram', 'Isosceles trapezoid', 'Rhombus'],
          correctIndex: 3,
          explanation: 'A rhombus (and square or kite) always has perpendicular diagonals; rectangles and general parallelograms do not.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'circles-arcs-chords',
      title: 'Circles: Angles, Arcs, Chords & Tangents',
      summary:
        'Work with central and inscribed angles, tangent-radius perpendicularity, arc length, sector area, and circle equations in the coordinate plane.',
      objectives: [
        'Relate central angles, inscribed angles, and intercepted arcs.',
        'Compute arc length and sector area using central angle proportions.',
        'Write and interpret standard circle equations (x − h)² + (y − k)² = r².',
      ],
      formulas: [
        {
          label: 'Central & Inscribed Angles',
          expression: 'Central = Arc measure   |   Inscribed = ½ · Intercepted Arc',
        },
        {
          label: 'Arc Length & Sector Area',
          expression: 's = (θ/360°)·2πr   |   A_sector = (θ/360°)·πr²',
        },
        {
          label: 'Circle Standard Equation',
          expression: '(x − h)² + (y − k)² = r²',
          note: 'Center at (h, k), radius r.',
        },
      ],
      concepts: [
        'A tangent line is always perpendicular to the radius drawn to the point of tangency.',
        'Two tangent segments drawn to a circle from the same exterior point are congruent.',
        'Any angle inscribed in a semicircle intercepts a 180° arc and therefore measures 90°.',
      ],
      example: {
        prompt: 'Find the arc length and sector area for a circle of radius 6 cm and central angle 120°.',
        steps: [
          'Fraction of the full circle: 120° / 360° = 1/3.',
          'Arc length = (1/3) · 2π(6) = 4π cm.',
          'Sector area = (1/3) · π(6²) = 12π cm².',
        ],
        answer: 'Arc length = 4π cm, Sector area = 12π cm²',
      },
      practice: [
        {
          question: 'An inscribed angle intercepts an arc of 116°. What is the measure of the inscribed angle?',
          options: ['116°', '58°', '232°', '64°'],
          correctIndex: 1,
          explanation: 'An inscribed angle is half the measure of its intercepted arc: 116° / 2 = 58°.',
        },
        {
          question: 'Identify the center and radius of (x + 3)² + (y − 5)² = 49.',
          options: ['Center (3, −5), r = 7', 'Center (−3, 5), r = 7', 'Center (−3, 5), r = 49', 'Center (3, 5), r = 7'],
          correctIndex: 1,
          explanation: 'Matching (x − h)² + (y − k)² = r² gives h = −3, k = 5, and r = √49 = 7.',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'area-surface-area-volume',
      title: '2D Area, Surface Area & 3D Volume',
      summary:
        'Calculate areas of polygons and composite shapes, and compute surface area and volume for prisms, cylinders, pyramids, cones, and spheres.',
      objectives: [
        'Compute areas of triangles, trapezoids, rhombi, and regular polygons.',
        'Apply V = Bh for prisms/cylinders and V = ⅓Bh for pyramids/cones.',
        'Calculate surface area and volume of spheres.',
      ],
      formulas: [
        {
          label: 'Prism / Cylinder Volume',
          expression: 'V = B · h   (Cylinder: V = πr²h)',
        },
        {
          label: 'Pyramid / Cone Volume',
          expression: 'V = (1/3) B · h   (Cone: V = (1/3)πr²h)',
        },
        {
          label: 'Sphere Surface Area & Volume',
          expression: 'SA = 4πr²   |   V = (4/3)πr³',
        },
      ],
      concepts: [
        'Capital B always stands for the area of the base polygon or circle, not a single side length.',
        'Use perpendicular height h for volume, and slant height l for lateral surface area of pyramids and cones.',
        'Cavalieri’s Principle states that two solids with equal height and equal cross-sectional areas at every level have equal volumes.',
      ],
      example: {
        prompt: 'Find the volume of a cone with radius 3 in and perpendicular height 10 in.',
        steps: [
          'Compute circular base area B = π(3²) = 9π in².',
          'Apply cone volume formula: V = (1/3) · 9π · 10 = 30π in³.',
        ],
        answer: '30π in³ (≈ 94.25 in³)',
      },
      practice: [
        {
          question: 'What is the surface area of a sphere with radius 5 cm?',
          options: ['25π cm²', '100π cm²', '500π/3 cm²', '20π cm²'],
          correctIndex: 1,
          explanation: 'SA = 4πr² = 4π(5²) = 100π cm².',
        },
        {
          question: 'A trapezoid has bases 8 m and 14 m and height 6 m. Find its area.',
          options: ['66 m²', '132 m²', '44 m²', '72 m²'],
          correctIndex: 0,
          explanation: 'A = ½(b₁ + b₂)h = ½(8 + 14)(6) = 11 × 6 = 66 m².',
        },
      ],
    },
  ],
};
