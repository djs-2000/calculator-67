import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CalculatorWidget } from '../calculator/CalculatorWidget';
import { MATH_COURSES } from '../math';

interface CalculatorPageProps {
  onSecretSequence?: () => void;
  onNavigate?: (to: string) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onSecretSequence,
  onNavigate,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      <section
        aria-label="Calculator"
        className="min-h-[52vh] flex flex-col items-center justify-center"
      >
        <CalculatorWidget onSecretSequence={onSecretSequence} />
      </section>

      <section
        aria-label="High School Math Review Directory"
        className="pt-8 border-t border-slate-200 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Study Resources</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">6 Courses</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">60 Review Pages</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              High School Math Review
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Ten structured review pages per course covering formulas, rules, worked
              examples, and self-check practice problems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate?.('/formulas')}
              className="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-xs font-medium text-slate-800 inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Formula Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('/courses')}
              className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Browse All 60 Pages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATH_COURSES.map((course) => (
            <article
              key={course.slug}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{course.level}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{course.pages.length} Pages</span>
                </div>
                <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                  {course.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {course.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate?.(`/courses/${course.slug}/${course.pages[0].slug}`)
                }
                className="self-start text-xs font-medium text-slate-900 hover:underline inline-flex items-center gap-1.5"
              >
                <span>Open 10-Page Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
