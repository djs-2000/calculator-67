export interface MathFormula {
  label: string;
  expression: string;
  note?: string;
}

export interface MathWorkedExample {
  prompt: string;
  steps: string[];
  answer: string;
}

export interface MathPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MathReviewPage {
  pageNumber: number;
  slug: string;
  title: string;
  summary: string;
  objectives: string[];
  formulas: MathFormula[];
  concepts: string[];
  example: MathWorkedExample;
  practice: MathPracticeQuestion[];
}

export interface MathCourse {
  slug: string;
  title: string;
  level: string;
  summary: string;
  pages: MathReviewPage[];
}
