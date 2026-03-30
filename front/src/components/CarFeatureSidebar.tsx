'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CarFeatureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHotspot: string | null;
  getHotspotContent: () => {
    title: string;
    subtitle?: string;
    images?: string[];
    video?: string;
    texts?: string[];
    image?: string;
  } | null | undefined;
  currentHotspotImage: number;
  setCurrentHotspotImage: (index: number) => void;
  sectionType?: 'exterior' | 'interior';
}

const CarFeatureSidebar: React.FC<CarFeatureSidebarProps> = ({
  isOpen,
  onClose,
  selectedHotspot,
  getHotspotContent,
  currentHotspotImage,
  setCurrentHotspotImage,
  sectionType = 'exterior',
}) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock scroll when open (drawer is fixed to viewport)
  useLayoutEffect(() => {
    if (!isOpen || !mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);

  const content =
    isOpen && selectedHotspot ? getHotspotContent() : null;
  const canShow = Boolean(isOpen && selectedHotspot && content);

  const totalItems = content
    ? (content.video ? 1 : 0) +
      (content.images?.length || 0) +
      (content.image ? 1 : 0)
    : 0;

  const nextImage = () => {
    if (totalItems > 1) {
      setCurrentHotspotImage((currentHotspotImage + 1) % totalItems);
    }
  };

  const prevImage = () => {
    if (totalItems > 1) {
      setCurrentHotspotImage(
        currentHotspotImage === 0 ? totalItems - 1 : currentHotspotImage - 1
      );
    }
  };

  const panel = (
    <AnimatePresence mode="wait">
      {canShow && content && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[110]"
            aria-hidden
            onClick={onClose}
          />

          <motion.div
            key="sidebar-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="car-feature-sidebar-title"
            className="fixed top-0 right-0 z-[120] flex w-full max-w-[100vw] flex-col bg-white shadow-2xl md:w-[500px] h-[100dvh] max-h-[100dvh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div
              className={`flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain ${
                isMobile && sectionType === 'exterior'
                  ? 'justify-start px-4 pb-8 pt-14'
                  : 'justify-start px-4 pb-8 pt-14 md:justify-center md:py-8'
              }`}
            >
              <div className="flex w-full flex-none flex-col items-center">
                <div
                  className={`relative flex w-full items-center justify-center overflow-hidden px-1 md:px-2 ${
                    isMobile && sectionType === 'exterior'
                      ? 'h-[min(28vh,220px)] min-h-[140px] max-w-[92%]'
                      : 'h-[220px] min-h-[220px] md:h-[min(45vh,420px)] md:min-h-[320px]'
                  }`}
                >
                  {content!.video && currentHotspotImage === 0 && (
                    <figure className="flex h-full w-full items-center justify-center rounded-lg bg-black/5">
                      <video
                        key={content!.video}
                        src={content!.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="block h-full w-full object-contain"
                      />
                    </figure>
                  )}

                  {content!.images &&
                    content!.images.length > 0 &&
                    currentHotspotImage >= (content!.video ? 1 : 0) && (
                      <img
                        src={
                          content!.images[
                            currentHotspotImage - (content!.video ? 1 : 0)
                          ]
                        }
                        alt={content!.title}
                        className="h-full w-full object-contain"
                      />
                    )}

                  {!content!.video &&
                    (!content!.images || content!.images.length === 0) &&
                    content!.image && (
                      <img
                        src={content!.image}
                        alt={content!.title}
                        className="h-full w-full object-contain"
                      />
                    )}

                  {totalItems > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 md:left-2 md:h-10 md:w-10"
                        aria-label="Previous"
                      >
                        <svg
                          className="h-4 w-4 md:h-5 md:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 md:right-2 md:h-10 md:w-10"
                        aria-label="Next"
                      >
                        <svg
                          className="h-4 w-4 md:h-5 md:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {totalItems > 1 && (
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 md:bottom-3 md:gap-2">
                      {Array.from({ length: totalItems }, (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentHotspotImage(index)}
                          className={`rounded-full transition-all duration-300 ${
                            index === currentHotspotImage
                              ? 'h-1.5 w-6 bg-gray-800 md:h-2 md:w-8'
                              : 'h-1.5 w-4 bg-gray-400 hover:bg-gray-500 md:h-2 md:w-5'
                          }`}
                          aria-label={`Slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h2
                id="car-feature-sidebar-title"
                className={`mt-4 w-full shrink-0 px-2 text-center font-bold text-gray-800 md:mt-6 ${
                  isMobile && sectionType === 'exterior'
                    ? 'text-base'
                    : 'text-lg md:text-2xl'
                }`}
              >
                {content!.title}
              </h2>

              {content!.texts && (
                <div
                  className={`mt-3 w-full max-w-md shrink-0 px-2 text-center md:max-w-lg ${
                    isMobile && sectionType === 'exterior' ? 'max-w-[92%]' : ''
                  }`}
                >
                  <p
                    className={`leading-relaxed text-gray-700 ${
                      isMobile && sectionType === 'exterior'
                        ? 'text-sm'
                        : 'text-base md:text-lg'
                    }`}
                  >
                    {content!.texts[currentHotspotImage] ||
                      content!.texts[0] ||
                      ''}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(panel, document.body);
};

export default CarFeatureSidebar;
