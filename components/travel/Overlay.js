'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Slide from '@/components/travel/Slide';

export default function Overlay({
  overlayCity,
  currentSlide,
  handleClose,
  onSlideChange,
}) {
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !carouselRef.current || !overlayCity?.images?.length) {
      return;
    }

    window.setTimeout(() => {
      if (carouselRef.current) {
        const slideWidth = carouselRef.current.clientWidth;
        carouselRef.current.scrollLeft = slideWidth * currentSlide;
      }
    }, 0);
  }, [isMobile, overlayCity, currentSlide]);

  const visibleSlides = useMemo(() => {
    if (!overlayCity) {
      return [];
    }

    const { images } = overlayCity;
    if (isMobile) {
      return images.map((imageSrc, index) => ({
        imageSrc,
        index,
        isActive: index === currentSlide,
      }));
    }

    if (!carouselRef.current) {
      return [];
    }

    const slideWidth = window.innerWidth > 1428 ? 400 : window.innerWidth * 0.28;
    const slideMargin = window.innerWidth * 0.02;
    const rect = carouselRef.current.getBoundingClientRect();
    const styles = getComputedStyle(carouselRef.current);
    const contentLeft =
      rect.left +
      carouselRef.current.clientLeft +
      (parseFloat(styles.paddingLeft) || 0);
    const contentWidth =
      carouselRef.current.clientWidth -
      (parseFloat(styles.paddingLeft) || 0) -
      (parseFloat(styles.paddingRight) || 0);
    const centerLeft = contentLeft + contentWidth / 2 - slideWidth / 2;

    const slides = [];

    if (currentSlide < images.length) {
      slides.push({
        imageSrc: images[currentSlide],
        index: currentSlide,
        isActive: true,
        left: centerLeft,
      });
    }

    if (currentSlide > 0) {
      slides.push({
        imageSrc: images[currentSlide - 1],
        index: currentSlide - 1,
        isActive: false,
        left: centerLeft - slideWidth - slideMargin,
      });
    }

    if (currentSlide + 1 < images.length) {
      slides.push({
        imageSrc: images[currentSlide + 1],
        index: currentSlide + 1,
        isActive: false,
        left: centerLeft + slideWidth + slideMargin,
      });
    }

    return slides.sort((a, b) => a.index - b.index);
  }, [overlayCity, currentSlide, isMobile]);

  const navigateCarousel = (direction) => {
    if (!overlayCity) return;

    const totalImages = overlayCity.images.length;
    if (direction === 'next') {
      onSlideChange(Math.min(currentSlide + 1, totalImages - 1));
      return;
    }

    onSlideChange(Math.max(currentSlide - 1, 0));
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const nextIndex = Math.round(
      carouselRef.current.scrollLeft / carouselRef.current.clientWidth,
    );
    if (nextIndex !== currentSlide) {
      onSlideChange(nextIndex);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div
        className={`fixed inset-0 z-[1000] flex flex-col bg-black text-white transition-transform duration-500 ease-in-out ${
          overlayCity ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ perspective: '1000px' }}
      >
        <button
          onClick={handleClose}
          className="absolute right-6 top-4 z-[1001] rounded border-2 border-white px-3 py-1 text-2xl text-white"
        >
          ×
        </button>

        {overlayCity && overlayCity.images.length > 0 ? (
          <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden">
            {!isMobile && overlayCity.images.length > 1 ? (
              <>
                {currentSlide > 0 ? (
                  <button
                    onClick={() => navigateCarousel('prev')}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-3xl text-white"
                  >
                    &lt;
                  </button>
                ) : null}
                {currentSlide < overlayCity.images.length - 1 ? (
                  <button
                    onClick={() => navigateCarousel('next')}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-3xl text-white"
                  >
                    &gt;
                  </button>
                ) : null}
              </>
            ) : null}

            <div
              ref={carouselRef}
              onScroll={isMobile ? handleScroll : undefined}
              className={`relative z-[1] mx-auto flex h-full w-full items-center ${
                isMobile
                  ? 'snap-x snap-mandatory overflow-x-auto px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  : 'p-[2vw]'
              }`}
            >
              {overlayCity.images[0] !== 'NA' ? (
                visibleSlides.map(({ imageSrc, index, left, isActive }) => (
                  <Slide
                    key={index}
                    imageSrc={imageSrc}
                    left={left}
                    isActive={isActive}
                    isMobile={isMobile}
                    slideIndex={index}
                    cityName={overlayCity.name}
                  />
                ))
              ) : (
                <span className="mx-auto text-white/70">No photos.</span>
              )}
            </div>

            <div className="absolute bottom-8 left-1/2 z-[1003] flex -translate-x-1/2 flex-col items-center text-white">
              <h1 className="rounded-2xl bg-black/50 px-4 py-2 text-center text-xl font-semibold">
                {overlayCity.name}
              </h1>
              {isMobile && overlayCity.images.length > 1 ? (
                <div className="mt-3 flex items-center justify-center rounded-full bg-black/50 px-4 py-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Swipe
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
