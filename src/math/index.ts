import { algebra1Course } from './courses/algebra1';
import { geometryCourse } from './courses/geometry';
import { algebra2Course } from './courses/algebra2';
import { precalculusCourse } from './courses/precalculus';
import { calculusCourse } from './courses/calculus';
import { statisticsCourse } from './courses/statistics';
import { type MathCourse, type MathReviewPage } from './types';

export const MATH_COURSES: MathCourse[] = [
  algebra1Course,
  geometryCourse,
  algebra2Course,
  precalculusCourse,
  calculusCourse,
  statisticsCourse,
];

export function findCourseBySlug(slug: string): MathCourse | null {
  return MATH_COURSES.find((c) => c.slug === slug) ?? null;
}

export function findCoursePage(
  courseSlug: string,
  pageSlug?: string
): { course: MathCourse; page: MathReviewPage } | null {
  const course = findCourseBySlug(courseSlug);
  if (!course) return null;
  if (!pageSlug) {
    return { course, page: course.pages[0] };
  }
  const page = course.pages.find((p) => p.slug === pageSlug);
  if (!page) return { course, page: course.pages[0] };
  return { course, page };
}
