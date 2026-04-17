'use client';

import { useState } from 'react';

export default function Slide({
  imageSrc,
  left,
  isActive,
  isMobile,
  cityName,
  slideIndex,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={
        isMobile
          ? 'relative h-full w-full shrink-0 snap-center'
          : 'absolute aspect-[9/16] w-[28vw] max-w-[400px] transition-all duration-300 ease-in-out'
      }
      style={
        isMobile
          ? undefined
          : {
              left: `${left}px`,
              transform: `scale(${isActive ? 1 : 0.75})`,
              zIndex: isActive ? 2 : 1,
            }
      }
    >
      <div
        className={`relative w-full overflow-hidden ${
          isMobile ? 'aspect-[9/16]' : 'h-full rounded-[10px]'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.8),rgba(192,192,192,0.5),rgba(0,0,0,0.8))]"
            style={{ filter: loaded ? 'blur(0px)' : 'blur(30px)' }}
          />
        </div>

        <img
          src={imageSrc}
          alt={`${cityName} photo ${slideIndex + 1}`}
          className={`relative h-full w-full object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
