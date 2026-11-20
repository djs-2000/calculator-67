import React, { useState } from 'react';
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
    <article
      className="bg-white border-b border-[#d4d4d4] pb-5 flex flex-col"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <div className="aspect-[4/3] bg-white border border-[#e5e5e5] mb-3 overflow-hidden">
        {thumbSrc && !imgFailed ? (
          <img
            src={thumbSrc}
            alt={guide.title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover grayscale contrast-90 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center bg-white">
            <span className="text-xs italic text-[#666666]">
              Diagram Preview: {guide.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="text-xs text-[#666666] italic">
          {categoryName} ·{' '}
          {guide.mode === 'external'
            ? 'External Module'
            : guide.mode === 'embed'
              ? 'Embedded Module'
              : 'Interactive Module'}
        </div>

        <h3 className="mt-1 text-base font-normal text-[#333333] leading-snug">
          {guide.title}
        </h3>

        <p className="mt-1.5 text-sm text-[#4a4a4a] leading-relaxed line-clamp-2 flex-1">
          {guide.description}
        </p>

        <div className="mt-3 pt-2">
          <button
            type="button"
            onClick={() => onOpen(guide)}
            className="text-sm text-[#333333] underline underline-offset-4 hover:text-black transition-colors cursor-pointer bg-transparent p-0"
          >
            {guide.mode === 'external' ? 'Begin Exercise ↗' : 'Begin Exercise →'}
          </button>
        </div>
      </div>
    </article>
  );
};
