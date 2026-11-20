import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { MATH_COURSES } from '../math';

interface CoursesPageProps {
  onNavigate: (to: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('all');

  const trimmedQuery = query.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    return MATH_COURSES.filter(
      (c) => selectedCourseSlug === 'all' || c.slug === selectedCourseSlug
    ).map((course) => {
      if (!trimmedQuery) {
        return { course, matchingPages: course.pages };
      }
      const courseMatches =
        course.title.toLowerCase().includes(trimmedQuery) ||
        course.summary.toLowerCase().includes(trimmedQuery);
      const matchingPages = course.pages.filter(
        (p) =>
          courseMatches ||
          p.title.toLowerCase().includes(trimmedQuery) ||
          p.summary.toLowerCase().includes(trimmedQuery) ||
          p.formulas.some(
            (f) =>
              f.label.toLowerCase().includes(trimmedQuery) ||
              f.expression.toLowerCase().includes(trimmedQuery)
          )
      );
      return { course, matchingPages };
    }).filter((entry) => entry.matchingPages.length > 0);
  }, [selectedCourseSlug, trimmedQuery]);

  const totalMatchingPages = filteredCourses.reduce(
    (acc, item) => acc + item.matchingPages.length,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>High School Mathematics</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">6 Courses</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">60 Review Pages</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 text-balance">
            Course Review Library
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Structured 10-page review guides covering every core high school math course,
            complete with formulas, step-by-step worked examples, and self-check practice.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, theorems, or formulas..."
            aria-label="Search math review topics"
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Course Filter Tabs */}
      <div
        className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg"
        role="tablist"
        aria-label="Filter by math course"
      >
        <button
          type="button"
          onClick={() => setSelectedCourseSlug('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedCourseSlug === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Courses
        </button>
        {MATH_COURSES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSelectedCourseSlug(c.slug)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCourseSlug === c.slug
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {totalMatchingPages === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-sm font-medium text-slate-900">No matching review pages found</p>
          <p className="mt-1 text-xs text-slate-500">
            Clear your search or switch back to All Courses.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCourseSlug('all');
            }}
            className="mt-4 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCourses.map(({ course, matchingPages }) => (
            <section
              key={course.slug}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{course.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">{matchingPages.length} of 10 Pages</span>
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                    {course.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate(`/courses/${course.slug}/${course.pages[0].slug}`)
                  }
                  className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Start Page 01</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchingPages.map((page) => (
                  <button
                    key={page.slug}
                    type="button"
                    onClick={() => onNavigate(`/courses/${course.slug}/${page.slug}`)}
                    className="group text-left p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-mono-num text-slate-500">
                        Page {String(page.pageNumber).padStart(2, '0')}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-slate-900 group-hover:text-slate-950 truncate">
                        {page.title}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {page.summary}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 shrink-0 mt-1 transition-colors" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
