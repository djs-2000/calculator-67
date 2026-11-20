import React, { useState } from 'react';
import { BookOpen, ExternalLink, Compass } from 'lucide-react';
import { type GuideItem } from '../guides/types';
import { resolveThumbnailUrl } from '../guides/thumbnails';

interface GuideCardProps {
  guide: GuideItem;
  categoryName: string;
  onOpen: (guide: GuideItem) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  categoryName,
  onOpen,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const thumbSrc = resolveThumbnailUrl(guide.thumbnail_url, guide.slug);

  return (
    <article className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col transition-shadow duration-150 hover:shadow-sm">
      <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 relative overflow-hidden">
        {thumbSrc && !imgFailed ? (
          <img
            src={thumbSrc}
            alt={guide.title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 px-4 text-center">
            <Compass className="w-8 h-8 stroke-[1.5]" />
            <span className="text-xs font-medium text-slate-500 truncate max-w-full">
              {guide.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{categoryName}</span>
          <span aria-hidden="true">·</span>
          <span>
            {guide.mode === 'external'
              ? 'External Reference'
              : guide.mode === 'embed'
                ? 'Embedded Guide'
                : 'Interactive Guide'}
          </span>
        </div>

        <h3 className="mt-1.5 text-base font-semibold text-slate-900 leading-snug">
          {guide.title}
        </h3>

        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-2 flex-1">
          {guide.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onOpen(guide)}
            className="w-full py-2 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            {guide.mode === 'external' ? (
              <>
                <span>Open Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Guide</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
