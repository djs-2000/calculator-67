import gridThumb from '../assets/images/guide_thumb_grid.jpg';
import matrixThumb from '../assets/images/guide_thumb_matrix.jpg';
import reboundThumb from '../assets/images/guide_thumb_rebound.jpg';
import deductionThumb from '../assets/images/guide_thumb_deduction.jpg';

const BUILTIN_THUMBS: Record<string, string> = {
  'builtin:grid-path': gridThumb,
  'builtin:powers-merge': matrixThumb,
  'builtin:elastic-reflection': reboundThumb,
  'builtin:adjacency-deduction': deductionThumb,
  'grid-path': gridThumb,
  'powers-merge': matrixThumb,
  'elastic-reflection': reboundThumb,
  'adjacency-deduction': deductionThumb,
};

export function resolveThumbnailUrl(thumbnailUrl: string, slug: string): string | null {
  const trimmed = (thumbnailUrl ?? '').trim();
  if (trimmed && BUILTIN_THUMBS[trimmed]) {
    return BUILTIN_THUMBS[trimmed];
  }
  if (
    trimmed &&
    (trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('/'))
  ) {
    return trimmed;
  }
  if (BUILTIN_THUMBS[slug]) {
    return BUILTIN_THUMBS[slug];
  }
  return null;
}
