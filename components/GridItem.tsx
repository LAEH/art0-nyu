import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArtItem } from '../types';

interface GridItemProps {
  item: ArtItem;
  onReplace: (id: string, orientation: string) => void;
  onSelect: (item: ArtItem) => void;
  isPriority?: boolean;
}

// Detect browser for tier selection
const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

const GridItem: React.FC<GridItemProps> = ({ item, onReplace, onSelect, isPriority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(isPriority); // Priority items start visible
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading (non-priority items)
  useEffect(() => {
    if (isPriority) return; // Skip observer for priority items

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [isPriority]);

  // Precise Masonry Logic based on 50px row height
  const getSpanClass = (orientation: string) => {
    switch (orientation) {
      case 'portrait':
        return 'col-span-1 row-span-5 md:row-span-10';
      case 'landscape':
        return 'col-span-2 row-span-3 md:col-span-2 md:row-span-6';
      case 'square':
        return 'col-span-1 row-span-4 md:row-span-7';
      default:
        return 'col-span-1 row-span-4';
    }
  };

  // Smart image size selection based on viewport
  const getOptimalSize = () => {
    if (typeof window === 'undefined') return '1450';
    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    
    // Mobile: use 580 or 1450 based on DPR
    if (width < 768) {
      return dpr > 1.5 ? '1450' : '580';
    }
    // Desktop: use 1450 or originals based on DPR
    return dpr > 1.5 ? 'originals' : '1450';
  };

  const optimalSize = getOptimalSize();

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: isSafari ? 300 : 250, // Safari can handle stiffer springs
        damping: isSafari ? 25 : 30,
        mass: 0.8
      }}
      className={`relative cursor-pointer ${getSpanClass(item.meta.orientation)}`}
      onClick={() => onReplace(item.id, item.meta.orientation)}
      onContextMenu={(e) => {
        e.preventDefault();
        onSelect(item);
      }}
      style={{
        // GPU acceleration
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Placeholder background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-sm"
        style={{
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {/* Image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          srcSet={`${item.urls['290']} 290w, ${item.urls['580']} 580w, ${item.urls['1450']} 1450w, ${item.urls['originals']} 2000w`}
          sizes={
            item.meta.orientation === 'landscape'
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 768px) 50vw, 25vw'
          }
          src={item.urls[optimalSize]}
          alt=""
          className="w-full h-full object-contain absolute inset-0"
          onLoad={() => setIsLoaded(true)}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          {...(isPriority ? { fetchpriority: 'high' } : {})}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ 
            duration: isSafari ? 0.6 : 0.4, // Safari gets smoother fade
            ease: [0.25, 0.1, 0.25, 1] // Custom easing for smoothness
          }}
          style={{
            // GPU-friendly properties only
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: isLoaded ? 'auto' : 'opacity',
          }}
        />
      )}
    </motion.div>
  );
};

export default GridItem;
