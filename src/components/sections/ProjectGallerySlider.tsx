'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from '@/lib/gsap';
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

/**
 * Edge-to-edge image gallery — same horizontal flex layout as the original
 * marquee, but click-controlled instead of scroll-driven. Each click of
 * prev/next translates the track by exactly one image width and the items
 * loop infinitely (we keep three rendered copies of the collection and
 * snap back to the middle copy whenever we drift onto a neighbour).
 */
export default function ProjectGallerySlider({ images, alt }: ProjectGallerySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const offsetRef = useRef(0);
  const [count] = useState(images.length);

  const move = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    const collection = collectionRef.current;
    if (!track || !collection || animatingRef.current) return;

    // Width of a single item — we measure the first item in the centre copy.
    const firstItem = collection.querySelector<HTMLElement>('.project_image-marquee-item');
    if (!firstItem) return;
    const step = firstItem.offsetWidth;
    const collectionWidth = collection.offsetWidth;

    animatingRef.current = true;
    offsetRef.current -= dir * step;

    gsap.to(track, {
      x: offsetRef.current,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        // Snap back into the middle copy whenever we cross a collection
        // boundary, so the track can keep advancing forever without ever
        // running out of items.
        if (offsetRef.current <= -2 * collectionWidth) {
          offsetRef.current += collectionWidth;
          gsap.set(track, { x: offsetRef.current });
        } else if (offsetRef.current >= 0) {
          offsetRef.current -= collectionWidth;
          gsap.set(track, { x: offsetRef.current });
        }
        animatingRef.current = false;
      },
    });
  }, []);

  // Set the initial track offset to -1 × collection width so we start at
  // the centre copy and have one full collection's worth of items both to
  // the left and right of the visible area.
  useEffect(() => {
    const track = trackRef.current;
    const collection = collectionRef.current;
    if (!track || !collection) return;
    const apply = () => {
      offsetRef.current = -collection.offsetWidth;
      gsap.set(track, { x: offsetRef.current });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  if (!count) return null;

  // Render the collection three times: [clone] [primary] [clone] so we
  // can shift in either direction without seeing an empty edge.
  const renderCollection = (key: string) => (
    <div
      key={key}
      ref={key === 'primary' ? collectionRef : undefined}
      className="project_image-marquee-collection"
    >
      {images.map((image, i) => {
        const src = urlFor(image);
        if (!src) return null;
        const w = image.asset?.metadata?.dimensions?.width ?? 4;
        const h = image.asset?.metadata?.dimensions?.height ?? 3;
        const aspectRatio = w / h;
        return (
          <div key={`${key}-${image._key ?? i}`} className="project_image-marquee-item">
            <div className="project_image-marquee-inner u-position-relative u-overflow-hidden">
              <Image
                src={src}
                width={Math.round(320 * aspectRatio)}
                height={320}
                alt={image.alt ?? alt}
                className="project_image-marquee-img"
                style={{ aspectRatio: `${w} / ${h}` }}
              />
              <div className="project_image-marquee-overlay u-cover-absolute u-pointer-off"></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="project_image-marquee project_gallery-slider u-position-relative">
      <div className="project_image-marquee-mask u-width-full u-overflow-hidden">
        <div ref={trackRef} className="project_image-marquee-track">
          {renderCollection('clone-pre')}
          {renderCollection('primary')}
          {renderCollection('clone-post')}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => move(-1)}
            className="project_gallery-button is-prev projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
              <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => move(1)}
            className="project_gallery-button is-next projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
              <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
