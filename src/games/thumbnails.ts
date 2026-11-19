import snakeThumb from '../assets/images/game_thumb_snake_1795058758556.jpg';
import puzzle2048Thumb from '../assets/images/game_thumb_2048_1795058759174.jpg';
import breakoutThumb from '../assets/images/game_thumb_breakout_1795058758592.jpg';
import minesweeperThumb from '../assets/images/game_thumb_minesweeper_1795058758430.jpg';

const BUILTIN_THUMBS: Record<string, string> = {
  'builtin:snake': snakeThumb,
  'builtin:2048': puzzle2048Thumb,
  'builtin:breakout': breakoutThumb,
  'builtin:minesweeper': minesweeperThumb,
  snake: snakeThumb,
  '2048': puzzle2048Thumb,
  breakout: breakoutThumb,
  minesweeper: minesweeperThumb,
};

export function resolveThumbnailUrl(thumbnailUrl: string, slug: string): string | null {
  const trimmed = (thumbnailUrl ?? '').trim();
  if (trimmed && BUILTIN_THUMBS[trimmed]) {
    return BUILTIN_THUMBS[trimmed];
  }
  if (trimmed && (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/'))) {
    return trimmed;
  }
  if (BUILTIN_THUMBS[slug]) {
    return BUILTIN_THUMBS[slug];
  }
  return null;
}
