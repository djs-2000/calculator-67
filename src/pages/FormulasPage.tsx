import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { MATH_COURSES } from '../math';

interface FormulasPageProps {
  onNavigate: (to: string) => void;
}

export const FormulasPage: React.FC<FormulasPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const allFormulas = useMemo(() => {
    const items: Array<{
      courseSlug: string;
      courseTitle: string;
      pageSlug: string;
      pageNumber: number;
      pageTitle: string;
      label: string;
      expression: string;
      note?: string;
    }> = [];

    for (const course of MATH_COURSES) {
      for (const page of course.pages) {
        for (const f of page.formulas) {
          items.push({
            courseSlug: course.slug,
            courseTitle: course.title,
            pageSlug: page.slug,
            pageNumber: page.pageNumber,
            pageTitle: page.title,
            label: f.label,
            expression: f.expression,
            note: f.note,
          });
        }
      }
    }
    return items;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allFormulas.filter((item) => {
      if (courseFilter !== 'all' && item.courseSlug !== courseFilter) return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.expression.toLowerCase().includes(q) ||
        item.pageTitle.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [allFormulas, search, courseFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Reference Sheet</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{allFormulas.length} Formulas</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            High School Math Formula Sheet
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Quick-reference equations, theorems, and identities compiled from all 60
            course review pages.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter formulas (e.g. quadratic, sin, z-score)..."
            aria-label="Filter formulas"
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg"
        role="tablist"
        aria-label="Filter formulas by course"
      >
        <button
          type="button"
          onClick={() => setCourseFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            courseFilter === 'all'
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
            onClick={() => setCourseFilter(c.slug)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              courseFilter === c.slug
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-sm font-medium text-slate-900">No matching formulas</p>
          <p className="mt-1 text-xs text-slate-500">
            Try another search term or switch back to All Courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={`${item.courseSlug}-${item.pageSlug}-${idx}`}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{item.courseTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    Page {String(item.pageNumber).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-1 text-sm font-semibold text-slate-900">
                  {item.label}
                </h2>
                <div className="mt-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono-num text-slate-900 break-words">
                  {item.expression}
                </div>
                {item.note && (
                  <p className="mt-1.5 text-xs text-slate-500">{item.note}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate(`/courses/${item.courseSlug}/${item.pageSlug}`)
                }
                className="self-start text-xs font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <span>Review {item.pageTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
