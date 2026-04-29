'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { urlFor } from '@/lib/sanity/imageUrl';

interface GalleryImage {
  _key?: string;
  alt?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { dimensions?: { width: number; height: number } };
  };
}

interface ProjectGallerySliderProps {
  images: GalleryImage[];
  alt: string;
}

export default function ProjectGallerySlider({ images, alt }: ProjectGallerySliderProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = useCallback((dir: number) => {
    setIndex((current) => (current + dir + count) % count);
  }, [count]);

  if (!count) return null;

  return (
    <div className="project_gallery-slider u-position-relative">
      <div className="project_gallery-slider-track u-position-relative u-overflow-hidden">
        {images.map((image, i) => {
          const src = urlFor(image);
          if (!src) return null;
          const w = image.asset?.metadata?.dimensions?.width ?? 4;
          const h = image.asset?.metadata?.dimensions?.height ?? 3;
          const isActive = i === index;
          return (
            <div
              key={image._key ?? i}
              aria-hidden={!isActive}
              className="project_gallery-slide u-cover-absolute"
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.7s cubic-bezier(0.62,0.05,0.01,0.99)',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <Image
                src={src}
                fill
                alt={image.alt ?? alt}
                className="project_gallery-slide-img"
                sizes="(max-width: 767px) 100vw, 80vw"
                priority={i === 0}
                style={{ objectFit: 'cover' }}
              />
              <div className="project_image-marquee-overlay u-cover-absolute u-pointer-off"></div>
            </div>
          );
        })}
        {/* Maintain aspect ratio via the first image */}
        <div
          className="project_gallery-aspect"
          style={{
            aspectRatio: `${images[0]?.asset?.metadata?.dimensions?.width ?? 4} / ${images[0]?.asset?.metadata?.dimensions?.height ?? 3}`,
          }}
        />
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="project_gallery-button is-prev projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
              <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="project_gallery-button is-next projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
              <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
            </svg>
          </button>
        </>
      )}

      <div className="project_gallery-counter u-position-absolute u-text-style-small u-text-transform-uppercase">
        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>
    </div>
  );
}
