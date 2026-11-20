import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpen,
} from 'lucide-react';
import { MATH_COURSES, findCoursePage } from '../math';

interface CourseReviewPageProps {
  courseSlug: string;
  pageSlug?: string;
  onNavigate: (to: string) => void;
}

export const CourseReviewPage: React.FC<CourseReviewPageProps> = ({
  courseSlug,
  pageSlug,
  onNavigate,
}) => {
  const match = findCoursePage(courseSlug, pageSlug);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    setSelectedAnswers({});
  }, [courseSlug, pageSlug]);

  if (!match) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Course Not Found</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Select one of the six high school math review courses to begin studying.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/courses')}
          className="mt-5 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </button>
      </div>
    );
  }

  const { course, page } = match;
  const pageIdx = course.pages.findIndex((p) => p.slug === page.slug);
  const prevPage = pageIdx > 0 ? course.pages[pageIdx - 1] : null;
  const nextPage =
    pageIdx >= 0 && pageIdx < course.pages.length - 1
      ? course.pages[pageIdx + 1]
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Course Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('/courses')}
            className="font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Courses
          </button>
          <span aria-hidden="true">·</span>
          <span>{course.title}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num text-slate-900 font-medium">
            Page {String(page.pageNumber).padStart(2, '0')} of {course.pages.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="course-jump" className="text-xs text-slate-500">
            Switch Course
          </label>
          <select
            id="course-jump"
            value={course.slug}
            onChange={(e) => {
              const target = MATH_COURSES.find((c) => c.slug === e.target.value);
              if (target) {
                onNavigate(`/courses/${target.slug}/${target.pages[0].slug}`);
              }
            }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {MATH_COURSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8 items-start">
        {/* Left Navigation Index (10 Pages) */}
        <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs lg:sticky lg:top-20">
          <div className="pb-3 border-b border-slate-100">
            <div className="text-xs text-slate-500">{course.level}</div>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">
              {course.title}
            </h2>
          </div>

          <nav className="mt-3 space-y-1" aria-label={`${course.title} pages`}>
            {course.pages.map((item) => {
              const active = item.slug === page.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => onNavigate(`/courses/${course.slug}/${item.slug}`)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-start gap-2.5 ${
                    active
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`font-mono-num shrink-0 ${
                      active ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {String(item.pageNumber).padStart(2, '0')}
                  </span>
                  <span className="leading-snug">{item.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/formulas')}
              className="w-full py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Formula Sheet
            </button>
          </div>
        </aside>

        {/* Main Review Content */}
        <article className="space-y-6 min-w-0">
          <header className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>{course.title}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">
                Review Page {String(page.pageNumber).padStart(2, '0')} / 10
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 text-balance">
              {page.title}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {page.summary}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <h2 className="text-xs font-semibold text-slate-900">
                Learning Objectives
              </h2>
              <ul className="mt-2 space-y-1.5">
                {page.objectives.map((obj, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="font-mono-num text-xs text-slate-400 mt-1">
                      {idx + 1}.
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Key Formulas */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-slate-900">
              Key Formulas & Definitions
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {page.formulas.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="text-xs font-medium text-slate-600">{f.label}</div>
                  <div className="mt-1.5 text-sm font-mono-num font-semibold text-slate-900 break-words">
                    {f.expression}
                  </div>
                  {f.note && (
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      {f.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Core Concepts */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-slate-900">
              Core Rules & Study Notes
            </h2>
            <ul className="mt-3 space-y-2.5">
              {page.concepts.map((concept, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-mono-num text-xs text-slate-400 mt-1 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Worked Example */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="text-xs text-slate-500">Step-by-Step Walkthrough</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Worked Example
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              {page.example.prompt}
            </p>
            <ol className="mt-4 space-y-2">
              {page.example.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-mono-num text-xs font-semibold text-slate-500 mt-1 shrink-0">
                    Step {idx + 1}:
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-3 border-t border-slate-100 text-sm">
              <span className="text-slate-600">Final Answer: </span>
              <span className="font-mono-num font-semibold text-slate-900">
                {page.example.answer}
              </span>
            </div>
          </section>

          {/* Interactive Self-Check Practice */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <div className="text-xs text-slate-500">Interactive Review</div>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Quick Self-Check
              </h2>
            </div>

            {page.practice.map((q, qIdx) => {
              const chosen = selectedAnswers[qIdx];
              const answered = chosen !== undefined;
              const isCorrect = answered && chosen === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    <span className="font-mono-num text-slate-500 mr-2">
                      Q{qIdx + 1}.
                    </span>
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isThisChosen = chosen === oIdx;
                      const isThisRight = oIdx === q.correctIndex;

                      let btnStyle =
                        'bg-white border-slate-200 text-slate-800 hover:border-slate-400';
                      if (answered) {
                        if (isThisRight) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium';
                        } else if (isThisChosen) {
                          btnStyle = 'bg-red-50 border-red-300 text-red-900';
                        } else {
                          btnStyle = 'bg-white border-slate-200 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [qIdx]: oIdx,
                            }))
                          }
                          className={`text-left px-3.5 py-2.5 rounded-md border text-xs sm:text-sm transition-colors ${btnStyle}`}
                        >
                          <span className="font-mono-num text-slate-400 mr-2">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div
                      className={`p-3 rounded-md border text-xs leading-relaxed flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-red-50 border-red-200 text-red-950'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
                      )}
                      <div>
                        <span className="font-semibold">
                          {isCorrect ? 'Correct: ' : 'Not quite: '}
                        </span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Bottom Page Pagination */}
          <nav
            aria-label="Page navigation"
            className="flex items-center justify-between gap-4 pt-2"
          >
            {prevPage ? (
              <button
                type="button"
                onClick={() =>
                  onNavigate(`/courses/${course.slug}/${prevPage.slug}`)
                }
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>
                  Page {String(prevPage.pageNumber).padStart(2, '0')}:{' '}
                  {prevPage.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextPage ? (
              <button
                type="button"
                onClick={() =>
                  onNavigate(`/courses/${course.slug}/${nextPage.slug}`)
                }
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors ml-auto"
              >
                <span>
                  Next (Page {String(nextPage.pageNumber).padStart(2, '0')})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('/courses')}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors ml-auto"
              >
                <span>All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
};
