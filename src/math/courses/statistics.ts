import { type MathCourse } from '../types';

export const statisticsCourse: MathCourse = {
  slug: 'statistics',
  title: 'AP Statistics',
  level: 'Data & Inference · Grades 11–12',
  summary:
    'Exploratory data analysis, normal distributions, linear regression, sampling & experiments, probability, sampling distributions, confidence intervals, and hypothesis tests.',
  pages: [
    {
      pageNumber: 1,
      slug: 'exploring-one-variable-data',
      title: 'Exploring One-Variable Data: Center, Spread & Shape',
      summary:
        'Describe quantitative distributions using SOCS (Shape, Outliers, Center, Spread), compare resistant vs. non-resistant statistics, and test outliers via the 1.5·IQR rule.',
      objectives: [
        'Compare mean/standard deviation vs. median/IQR for skewed distributions.',
        'Identify potential outliers using the 1.5·IQR fences.',
        'Explain how adding or multiplying a constant affects summary statistics.',
      ],
      formulas: [
        {
          label: 'Interquartile Range & Outlier Fences',
          expression: 'IQR = Q₃ − Q₁   |   Fences: Q₁ − 1.5(IQR)  and  Q₃ + 1.5(IQR)',
        },
        {
          label: 'Linear Transformation Effects (y = a + bx)',
          expression: 'New Center = a + b(Center)   |   New SD or IQR = |b| · (Old Spread)',
          note: 'Adding a constant shifts center but leaves spread unchanged.',
        },
      ],
      concepts: [
        'Use median and IQR when a distribution is strongly skewed or has outliers (resistant measures); use mean and SD for symmetric data.',
        'In a right-skewed distribution, the mean is typically pulled greater than the median.',
        'Multiplying every data value by b multiplies both center and spread (SD, IQR, range) by |b|.',
      ],
      example: {
        prompt: 'A dataset has Q₁ = 24 and Q₃ = 36. Is a value of 56 considered an outlier?',
        steps: [
          'Compute IQR = 36 − 24 = 12.',
          'Compute upper fence = Q₃ + 1.5(IQR) = 36 + 1.5(12) = 36 + 18 = 54.',
          'Since 56 > 54, 56 is an outlier.',
        ],
        answer: 'Yes (exceeds upper fence of 54)',
      },
      practice: [
        {
          question: 'Every exam score in a class (mean 74, SD 8) is increased by 5 bonus points. What are the new mean and SD?',
          options: ['Mean 79, SD 13', 'Mean 79, SD 8', 'Mean 74, SD 8', 'Mean 79, SD 40'],
          correctIndex: 1,
          explanation: 'Adding a constant shifts the mean (+5 → 79) but does not change spread (SD stays 8).',
        },
        {
          question: 'Which pair of statistics is resistant to extreme outliers?',
          options: ['Mean and Standard Deviation', 'Median and IQR', 'Mean and Range', 'Range and Variance'],
          correctIndex: 1,
          explanation: 'Median and IQR depend only on middle rank positions, not extreme tail values.',
        },
      ],
    },
    {
      pageNumber: 2,
      slug: 'normal-distributions-z-scores',
      title: 'Normal Distributions, Empirical Rule & Z-Scores',
      summary:
        'Standardize values into z-scores, apply the 68–95–99.7 Empirical Rule, and calculate areas and percentiles under Normal density curves.',
      objectives: [
        'Compute and interpret z-scores in standard deviation units.',
        'Apply the 68–95–99.7 rule for ±1, ±2, and ±3 SD intervals.',
        'Solve inverse Normal percentile problems to find cutoff values.',
      ],
      formulas: [
        {
          label: 'Standard Score (Z-Score)',
          expression: 'z = (x − μ) / σ',
        },
        {
          label: 'Empirical Rule N(μ, σ)',
          expression: '68% within ±1σ   |   95% within ±2σ   |   99.7% within ±3σ',
        },
      ],
      concepts: [
        'A z-score tells how many standard deviations an observation falls above (positive) or below (negative) the mean.',
        'Total area under any density curve equals 1 (100%).',
        'Standardizing every value in a distribution creates a new distribution with mean 0 and SD 1, preserving the original shape.',
      ],
      example: {
        prompt: 'Test scores follow N(500, 100). Using the Empirical Rule, what percentage of scores fall between 400 and 700?',
        steps: [
          '400 is 1 SD below mean (z = −1): half of 68% = 34% lies between 400 and 500.',
          '700 is 2 SD above mean (z = +2): half of 95% = 47.5% lies between 500 and 700.',
          'Add areas: 34% + 47.5% = 81.5%.',
        ],
        answer: '81.5%',
      },
      practice: [
        {
          question: 'A value has z = −1.5 in a distribution with mean 80 and SD 6. What is the raw value x?',
          options: ['71', '89', '78.5', '74'],
          correctIndex: 0,
          explanation: 'x = μ + zσ = 80 + (−1.5)(6) = 80 − 9 = 71.',
        },
        {
          question: 'Under the Empirical Rule, roughly what percentage of Normal observations exceed μ + 2σ?',
          options: ['5%', '2.5%', '16%', '0.15%'],
          correctIndex: 1,
          explanation: '95% fall within ±2σ, leaving 5% split across two symmetric tails, so 2.5% lie in the upper tail.',
        },
      ],
    },
    {
      pageNumber: 3,
      slug: 'two-variable-data-regression',
      title: 'Scatterplots, Correlation & Linear Regression',
      summary:
        'Describe two-variable relationships (DOFS), interpret correlation r and coefficient of determination r², fit least-squares regression lines, and inspect residual plots.',
      objectives: [
        'Interpret slope, y-intercept, r, and r² in real context.',
        'Compute LSRL slope and intercept from summary statistics.',
        'Assess linear model appropriateness using residual plots.',
      ],
      formulas: [
        {
          label: 'LSRL from Summary Stats',
          expression: 'ŷ = a + bx   where   b = r · (s_y / s_x)   and   a = ȳ − b·x̄',
        },
        {
          label: 'Coefficient of Determination',
          expression: 'r² = fraction of variation in y explained by linear relationship with x',
        },
      ],
      concepts: [
        'Every least-squares regression line passes directly through the centroid point (x̄, ȳ).',
        'A curved pattern in a residual plot indicates a linear model is NOT appropriate.',
        'Avoid extrapolation—making predictions far outside the observed x-interval.',
      ],
      example: {
        prompt: 'Data have x̄ = 10, s_x = 2, ȳ = 50, s_y = 10, and r = 0.8. Find the LSRL equation.',
        steps: [
          'Slope: b = r(s_y / s_x) = 0.8 × (10 / 2) = 4.',
          'Intercept: a = ȳ − b·x̄ = 50 − 4(10) = 10.',
          'LSRL: ŷ = 10 + 4x.',
        ],
        answer: 'ŷ = 10 + 4x',
      },
      practice: [
        {
          question: 'If r = −0.90 between car age and resale value, what percent of variation in resale value is accounted for by the LSRL?',
          options: ['−90%', '81%', '90%', '19%'],
          correctIndex: 1,
          explanation: 'r² = (−0.90)² = 0.81 = 81%.',
        },
        {
          question: 'Which feature in a residual plot supports using a linear model?',
          options: ['A U-shaped curve', 'A fan shape widening rightward', 'Random scatter centered around 0', 'All positive residuals'],
          correctIndex: 2,
          explanation: 'No leftover curve or systematic pattern (random scatter around zero) confirms linearity.',
        },
      ],
    },
    {
      pageNumber: 4,
      slug: 'sampling-experimental-design',
      title: 'Sampling Methods & Experimental Design',
      summary:
        'Differentiate observational studies from randomized experiments, recognize sampling biases, and apply the four pillars of experimental design.',
      objectives: [
        'Contrast SRS, stratified, cluster, and systematic random samples.',
        'Identify undercoverage, nonresponse, and response bias.',
        'Explain comparison, random assignment, control, and replication in experiments.',
      ],
      formulas: [
        {
          label: 'Scope of Inference Matrix',
          expression: 'Random selection → Generalize to population  |  Random assignment → Cause & effect',
        },
      ],
      concepts: [
        'Stratified sampling groups homogeneous strata and samples from EVERY stratum (reduces variability); cluster sampling selects whole heterogeneous clusters and surveys ALL members of chosen clusters.',
        'Only well-designed experiments with random assignment can establish cause-and-effect.',
        'Blocking in experiments plays the exact same variance-reducing role as stratifying in sampling.',
      ],
      example: {
        prompt: 'A study randomly selects 500 volunteers and randomly assigns half to a new study schedule and half to a standard schedule.',
        steps: [
          'Participants were volunteers (no random selection from a broader population).',
          'Treatments were randomly assigned to the 500 volunteers.',
          'Scope: Can infer cause-and-effect for volunteers like these, but cannot generalize to all students nationwide.',
        ],
        answer: 'Cause-and-effect yes; broad population generalization no',
      },
      practice: [
        {
          question: 'A school divides students by grade (9, 10, 11, 12) and randomly selects 25 students from each grade. This is:',
          options: ['Cluster sample', 'Stratified random sample', 'Convenience sample', 'Systematic sample'],
          correctIndex: 1,
          explanation: 'Sampling randomly inside every subgroup (stratum) is stratified random sampling.',
        },
        {
          question: 'Why is random assignment essential in an experiment?',
          options: ['Guarantees generalization to the entire world', 'Eliminates voluntary response bias', 'Balances lurking/confounding variables across groups', 'Replaces the need for replication'],
          correctIndex: 2,
          explanation: 'Random assignment creates roughly equivalent treatment groups, balancing confounding factors.',
        },
      ],
    },
    {
      pageNumber: 5,
      slug: 'probability-conditional-independence',
      title: 'Probability Rules, Conditional Probability & Independence',
      summary:
        'Apply general addition and multiplication rules, compute conditional probabilities using two-way tables and tree diagrams, and test independence mathematically.',
      objectives: [
        'Calculate P(A ∪ B), P(A ∩ B), and P(A | B).',
        'Distinguish mutually exclusive events from independent events.',
        'Apply tree diagrams to reverse conditional (Bayes) probabilities.',
      ],
      formulas: [
        {
          label: 'General Addition & Conditional Rules',
          expression: 'P(A∪B) = P(A)+P(B)−P(A∩B)   |   P(A|B) = P(A∩B) / P(B)',
        },
        {
          label: 'Independence Tests',
          expression: 'A, B independent  ⇔  P(A|B) = P(A)  ⇔  P(A∩B) = P(A)·P(B)',
        },
      ],
      concepts: [
        'Mutually exclusive events with positive probabilities are NEVER independent: knowing A happened forces P(B|A) = 0 ≠ P(B).',
        'Complement rule ("at least one"): P(at least 1) = 1 − P(none).',
      ],
      example: {
        prompt: 'Given P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.2, check if A and B are independent and find P(A ∪ B).',
        steps: [
          'Check independence: P(A)·P(B) = 0.4 × 0.5 = 0.20 = P(A ∩ B) ⇒ Independent!',
          'Union: P(A ∪ B) = 0.4 + 0.5 − 0.2 = 0.7.',
        ],
        answer: 'Independent; P(A ∪ B) = 0.7',
      },
      practice: [
        {
          question: 'A fair 6-sided die is rolled twice. What is the probability of rolling at least one 6?',
          options: ['1/3', '11/36', '25/36', '1/36'],
          correctIndex: 1,
          explanation: '1 − P(no 6 on either roll) = 1 − (5/6)² = 1 − 25/36 = 11/36.',
        },
        {
          question: 'If P(A) = 0.3, P(B) = 0.6, and A and B are mutually exclusive, what is P(A ∪ B)?',
          options: ['0.18', '0.72', '0.90', '0.30'],
          correctIndex: 2,
          explanation: 'Mutually exclusive means P(A ∩ B) = 0, so P(A ∪ B) = 0.3 + 0.6 = 0.90.',
        },
      ],
    },
    {
      pageNumber: 6,
      slug: 'random-variables-binomial-geometric',
      title: 'Random Variables, Binomial & Geometric Distributions',
      summary:
        'Compute expected value and standard deviation of discrete random variables, combine independent variables (variances add!), and model Binomial and Geometric counts.',
      objectives: [
        'Calculate E(X) and SD(X) for discrete distributions.',
        'Combine independent random variables: Var(X ± Y) = Var(X) + Var(Y).',
        'Verify BINS conditions for Binomial models.',
      ],
      formulas: [
        {
          label: 'Combining Independent Variables',
          expression: 'E(X ± Y) = E(X) ± E(Y)   |   SD(X ± Y) = √(σ_X² + σ_Y²)',
          note: 'Always add variances, even when subtracting X − Y!',
        },
        {
          label: 'Binomial Distribution B(n, p)',
          expression: 'P(X = k) = ₙCₖ p^k (1 − p)^(n−k)   |   μ = np,  σ = √(np(1−p))',
        },
        {
          label: 'Geometric Mean',
          expression: 'μ = 1 / p   (expected trials until first success)',
        },
      ],
      concepts: [
        'BINS criteria for Binomial: Binary outcome, Independent trials, fixed Number of trials n, Same probability p.',
        'Geometric models count trials until the first success (no fixed n).',
        'Never add standard deviations directly; square them into variances, add variances, then take the square root.',
      ],
      example: {
        prompt: 'A free-throw shooter makes 80% of shots independently. In 10 shots, find the mean and SD of makes.',
        steps: [
          'Identify Binomial B(10, 0.80).',
          'Mean: μ = np = 10(0.8) = 8 makes.',
          'Standard deviation: σ = √(10 · 0.8 · 0.2) = √1.6 ≈ 1.265 makes.',
        ],
        answer: 'Mean = 8, SD ≈ 1.265',
      },
      practice: [
        {
          question: 'Independent variables X and Y have σ_X = 3 and σ_Y = 4. What is the standard deviation of X − Y?',
          options: ['−1', '1', '5', '7'],
          correctIndex: 2,
          explanation: 'Variances always add: Var(X − Y) = 3² + 4² = 25, so SD = √25 = 5.',
        },
        {
          question: 'Each box of cereal has a 1/5 chance of holding a prize. What is the expected number of boxes opened until finding the first prize?',
          options: ['0.2', '4', '5', '2.5'],
          correctIndex: 2,
          explanation: 'Geometric expected value = 1 / p = 1 / (1/5) = 5 boxes.',
        },
      ],
    },
    {
      pageNumber: 7,
      slug: 'sampling-distributions-clt',
      title: 'Sampling Distributions & Central Limit Theorem',
      summary:
        'Describe shape, center, and spread of sampling distributions for sample proportions p̂ and sample means x̄, checking independence (10% condition) and normality conditions.',
      objectives: [
        'Compute mean and standard deviation of p̂ and x̄.',
        'Verify the Large Counts condition (np ≥ 10, n(1−p) ≥ 10) for proportions.',
        'Apply the Central Limit Theorem (n ≥ 30) for sample means.',
      ],
      formulas: [
        {
          label: 'Sampling Distribution of p̂',
          expression: 'μ_p̂ = p   |   σ_p̂ = √(p(1 − p) / n)',
        },
        {
          label: 'Sampling Distribution of x̄',
          expression: 'μ_x̄ = μ   |   σ_x̄ = σ / √n',
        },
      ],
      concepts: [
        'To cut the standard error of x̄ or p̂ in half, you must quadruple (×4) the sample size n.',
        '10% condition (n ≤ 0.10 N) justifies using standard deviation formulas when sampling without replacement.',
        'Central Limit Theorem: as n grows (conventionally n ≥ 30), x̄ becomes approximately Normal regardless of population skew.',
      ],
      example: {
        prompt: 'A population has mean μ = 60 and SD σ = 12. Find the mean and SD of x̄ for random samples of size n = 36.',
        steps: [
          'Mean of x̄ equals population mean: μ_x̄ = 60.',
          'Standard deviation of x̄: σ_x̄ = 12 / √36 = 12 / 6 = 2.',
          'Since n = 36 ≥ 30, the sampling distribution of x̄ is approximately Normal N(60, 2).',
        ],
        answer: 'Approximately N(60, 2)',
      },
      practice: [
        {
          question: 'By what factor must sample size n increase to reduce the standard error of a mean to 1/3 of its current value?',
          options: ['3', '6', '9', '1/3'],
          correctIndex: 2,
          explanation: 'Since SE = σ/√n, multiplying n by 9 multiplies √n by 3, cutting SE to 1/3.',
        },
        {
          question: 'Which condition checks approximate Normality for a sample proportion p̂?',
          options: ['n ≥ 30', 'np ≥ 10 and n(1 − p) ≥ 10', 'n ≤ 0.10N', 'σ known'],
          correctIndex: 1,
          explanation: 'Large Counts requires at least 10 expected successes and 10 expected failures.',
        },
      ],
    },
    {
      pageNumber: 8,
      slug: 'confidence-intervals',
      title: 'Confidence Intervals for Proportions & Means',
      summary:
        'Construct and interpret one-sample and two-sample z-intervals for proportions and t-intervals for means, and calculate required sample sizes for a target margin of error.',
      objectives: [
        'Check Random, 10%, and Normal/Large Counts conditions.',
        'Distinguish z* (proportions) from t* with df = n − 1 (means).',
        'Interpret both a confidence interval and a confidence level properly.',
      ],
      formulas: [
        {
          label: 'General Confidence Interval',
          expression: 'Point Estimate ± (Critical Value) × (Standard Error)',
        },
        {
          label: 'One-Prop z & One-Mean t',
          expression: 'p̂ ± z*√(p̂(1−p̂)/n)   |   x̄ ± t* (s / √n),  df = n − 1',
        },
      ],
      concepts: [
        'Increasing confidence level widens the interval (increases critical value); increasing sample size narrows the interval.',
        'A 95% confidence level means that in repeated random samples of size n, roughly 95% of resulting intervals will capture the true parameter—NOT that there is a 95% probability the parameter sits in one already-computed interval.',
        'When solving for minimum sample size n for a proportion with no prior p̂, use conservative p* = 0.5.',
      ],
      example: {
        prompt: 'In a survey of 400 residents, 240 support a bike lane. Build a 95% confidence interval (z* = 1.96).',
        steps: [
          'Compute p̂ = 240 / 400 = 0.60.',
          'Standard error: SE = √(0.60 × 0.40 / 400) = √(0.24 / 400) = √0.0006 ≈ 0.0245.',
          'Margin of error: ME = 1.96 × 0.0245 ≈ 0.048.',
          'Interval: 0.60 ± 0.048 = (0.552, 0.648).',
        ],
        answer: '(0.552, 0.648)',
      },
      practice: [
        {
          question: 'A 95% confidence interval for mean difference (μ₁ − μ₂) is (−1.4, 6.2). Can we conclude μ₁ ≠ μ₂ at α = 0.05?',
          options: ['Yes, because 6.2 > 0', 'No, because 0 is inside the interval', 'Yes, because it is asymmetric', 'Cannot tell'],
          correctIndex: 1,
          explanation: 'Because 0 (no difference) is a plausible value inside the interval, there is not convincing evidence of a difference.',
        },
        {
          question: 'What happens to a confidence interval when confidence increases from 90% to 99% (same sample)?',
          options: ['Becomes narrower', 'Becomes wider', 'Stays identical', 'Center shifts'],
          correctIndex: 1,
          explanation: 'Higher confidence requires a larger critical value, increasing margin of error and widening the interval.',
        },
      ],
    },
    {
      pageNumber: 9,
      slug: 'significance-testing-p-values',
      title: 'Significance Tests, P-Values, Errors & Power',
      summary:
        'Formulate null and alternative hypotheses, compute z and t test statistics, interpret p-values in context, and analyze Type I/II errors and statistical power.',
      objectives: [
        'Write hypotheses strictly in terms of population parameters (p or μ), never sample stats.',
        'Make reject / fail-to-reject decisions comparing p-value to α.',
        'Define Type I error, Type II error, and Power.',
      ],
      formulas: [
        {
          label: 'Test Statistic Structure',
          expression: 'Test Stat = (Statistic − Null Parameter) / Standard Error',
        },
        {
          label: 'Decision Rule',
          expression: 'p-value < α ⇒ Reject H₀   |   p-value ≥ α ⇒ Fail to Reject H₀',
        },
      ],
      concepts: [
        'Never say "accept H₀"; either reject H₀ or fail to reject H₀.',
        'Type I error (α): rejecting a true H₀ (false alarm). Type II error (β): failing to reject a false H₀.',
        'Power = 1 − β is the probability of correctly rejecting a false H₀; power increases when sample size n increases, α increases, or the true effect is farther from H₀.',
      ],
      example: {
        prompt: 'A coin fairness test (H₀: p = 0.5 vs Hₐ: p ≠ 0.5) yields p-value = 0.032 at α = 0.05. State the conclusion.',
        steps: [
          'Compare p-value to α: 0.032 < 0.05.',
          'Reject H₀.',
          'Conclusion: There is convincing statistical evidence that the true proportion of heads differs from 0.5.',
        ],
        answer: 'Reject H₀ (convincing evidence p ≠ 0.5)',
      },
      practice: [
        {
          question: 'If α = 0.05 and H₀ is actually true, what is the probability of committing a Type I error?',
          options: ['0.95', '0.05', '0.025', 'Depends on n'],
          correctIndex: 1,
          explanation: 'By definition, significance level α equals the probability of a Type I error when H₀ is true.',
        },
        {
          question: 'Which change increases the statistical power of a hypothesis test?',
          options: ['Decreasing sample size n', 'Lowering α from 0.05 to 0.01', 'Increasing sample size n', 'Using a smaller effect size'],
          correctIndex: 2,
          explanation: 'Larger sample size shrinks standard error, making true deviations easier to detect (higher power).',
        },
      ],
    },
    {
      pageNumber: 10,
      slug: 'chi-square-regression-inference',
      title: 'Chi-Square Tests & Linear Regression Inference',
      summary:
        'Select between Chi-Square Goodness-of-Fit, Homogeneity, and Independence tests, check expected count conditions, and run t-inference for regression slope β.',
      objectives: [
        'Distinguish GOF (1 variable, 1 sample) from Independence (2 variables, 1 sample) and Homogeneity (1 variable, 2+ populations).',
        'Calculate expected counts and degrees of freedom.',
        'Test slope H₀: β = 0 using t = b / SE_b with df = n − 2.',
      ],
      formulas: [
        {
          label: 'Chi-Square Statistic',
          expression: 'χ² = Σ [ (Observed − Expected)² / Expected ]',
          note: 'All expected counts must be at least 5.',
        },
        {
          label: 'Chi-Square Degrees of Freedom',
          expression: 'GOF: df = categories − 1   |   Two-way table: df = (rows − 1)(cols − 1)',
        },
        {
          label: 'Two-Way Expected Count',
          expression: 'Expected = (Row Total × Column Total) / Grand Total',
        },
      ],
      concepts: [
        'Chi-square tests are always right-tailed (upper-tail) because larger (O − E)² differences produce larger positive χ² values.',
        'Condition for Chi-Square checks EXPECTED counts ≥ 5, NOT observed counts.',
        'For regression slope inference, check LINER: Linear, Independent, Normal residuals, Equal SD across x, Random.',
      ],
      example: {
        prompt: 'A 3×4 contingency table tests independence between major and study preference. Find df and an expected cell count if Row 1 total is 80, Col 2 total is 50, and Grand total is 200.',
        steps: [
          'Degrees of freedom: df = (3 − 1)(4 − 1) = 2 × 3 = 6.',
          'Expected count = (80 × 50) / 200 = 4000 / 200 = 20.',
        ],
        answer: 'df = 6, Expected = 20',
      },
      practice: [
        {
          question: 'A die is rolled 60 times to test if all 6 faces are equally likely. What are the expected counts and df?',
          options: ['Expected = 10, df = 6', 'Expected = 10, df = 5', 'Expected = 12, df = 5', 'Expected = 6, df = 59'],
          correctIndex: 1,
          explanation: 'GOF with 6 faces: expected = 60/6 = 10 each; df = 6 − 1 = 5.',
        },
        {
          question: 'A linear regression t-test for slope uses n = 22 data points. What are the degrees of freedom?',
          options: ['22', '21', '20', '19'],
          correctIndex: 2,
          explanation: 'Slope t-inference has two estimated parameters (a and b), so df = n − 2 = 20.',
        },
      ],
    },
  ],
};
