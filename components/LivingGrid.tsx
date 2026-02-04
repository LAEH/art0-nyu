import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArtItem } from '../types';
import { 
  animations, 
  gpuAcceleration, 
  willChange, 
  imageOptimization,
  isSafari,
  isChrome 
} from '../motion';

interface LivingGridProps {
  items: ArtItem[];
  onSelect: (item: ArtItem) => void;
}

// Color mapping for placeholder backgrounds
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Black': '#1a1a1a',
    'White': '#f5f5f5',
    'Grey': '#9ca3af',
    'Gray': '#9ca3af',
    'Beige': '#d4c5b9',
    'Pink': '#fbbf24',
    'Cyan': '#06b6d4',
    'Brown': '#92400e',
  };
  return colorMap[colorName] || '#e5e7eb';
};

const LivingGrid: React.FC<LivingGridProps> = ({ items, onSelect }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Debounced resize handler for performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, []);

  const rows = useMemo(() => {
    const isMobile = windowWidth < 768;
    const processingItems = [...items];
    const generatedRows: { items: ArtItem[], type: 'hero' | 'pair' | 'triplet' }[] = [];
    let i = 0;

    while (i < processingItems.length) {
      let current = processingItems[i];
      const remaining = processingItems.length - i;
      
      if (current.meta.ratio > 1.8) {
        generatedRows.push({ items: [current], type: 'hero' });
        i++;
        continue;
      }

      if (isMobile) {
        const nextIsPortrait = remaining >= 2 && processingItems[i + 1].meta.ratio < 1.5;
        const makePair = nextIsPortrait && Math.random() > 0.4;

        if (makePair) {
          generatedRows.push({ items: [current, processingItems[i + 1]], type: 'pair' });
          i += 2;
        } else {
          const lastRow = generatedRows.length > 0 ? generatedRows[generatedRows.length - 1] : null;
          const isLastRowHero = lastRow && lastRow.items.length === 1;
          
          if (isLastRowHero && lastRow!.items[0].category === current.category) {
             let swapIndex = -1;
             for (let k = i + 1; k < processingItems.length; k++) {
                 if (processingItems[k].category !== current.category) {
                     swapIndex = k;
                     break;
                 }
             }
             if (swapIndex !== -1) {
                 const temp = processingItems[i];
                 processingItems[i] = processingItems[swapIndex];
                 processingItems[swapIndex] = temp;
                 current = processingItems[i];
             }
          }
          generatedRows.push({ items: [current], type: 'hero' });
          i++;
        }
      } else {
        // Desktop/Landscape: Portrait images CANNOT be hero (full row)
        const isPortrait = current.meta.ratio < 1;
        
        if (isPortrait) {
          // Force pairing for portrait images on desktop
          if (remaining >= 2) {
            generatedRows.push({ items: [current, processingItems[i + 1]], type: 'pair' });
            i += 2;
          } else {
            // Last portrait image, pair with previous if possible, otherwise force pair with next available
            generatedRows.push({ items: [current], type: 'pair' }); // Will be styled as pair
            i++;
          }
        } else if (
          remaining >= 3 &&
          processingItems[i + 1].meta.ratio < 1.5 &&
          processingItems[i + 2].meta.ratio < 1.5 &&
          Math.random() > 0.3
        ) {
          generatedRows.push({ items: [current, processingItems[i + 1], processingItems[i + 2]], type: 'triplet' });
          i += 3;
        } else if (remaining >= 2 && processingItems[i + 1].meta.ratio < 1.5) {
          generatedRows.push({ items: [current, processingItems[i + 1]], type: 'pair' });
          i += 2;
        } else {
          generatedRows.push({ items: [current], type: 'hero' });
          i++;
        }
      }
    }
    return generatedRows;
  }, [items, windowWidth]); 

  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => new Set(prev).add(itemId));
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {rows.map((row, rowIndex) => {
        const totalRatio = row.items.reduce((acc, it) => acc + it.meta.ratio, 0);
        const isPriority = rowIndex < 2; // First 2 rows get high priority

        return (
          <div key={`row-${rowIndex}`} className="flex w-full mb-4 md:mb-8 justify-center">
            {row.items.map((item, itemIndex) => {
              const widthPercent = (item.meta.ratio / totalRatio) * 100;
              const isLoaded = loadedImages.has(item.id);
              
              // Smart Sizes Attribute
              let sizes = '100vw';
              if (row.type === 'pair') sizes = '(max-width: 768px) 50vw, 45vw';
              if (row.type === 'triplet') sizes = '(max-width: 768px) 50vw, 30vw';
              if (row.type === 'hero') sizes = '(max-width: 768px) 100vw, 90vw';

              const scrollReveal = animations.scrollReveal(isPriority);
              
              return (
                <motion.div
                  key={item.id}
                  {...scrollReveal}
                  transition={{
                    ...scrollReveal.transition,
                    delay: isPriority ? itemIndex * 0.08 : 0,
                  }}
                  style={{ 
                    width: `${widthPercent}%`,
                    ...gpuAcceleration,
                  }}
                  className="relative px-2 md:px-4 cursor-pointer group flex flex-col justify-end"
                  onClick={() => onSelect(item)}
                >
                    <div className="w-full relative" style={{ aspectRatio: `${item.meta.ratio}` }}>
                        {/* Colored Placeholder */}
                        <div 
                          className="absolute inset-0 rounded-sm"
                          style={{
                            backgroundColor: getColorValue(item.meta.accent_color),
                            opacity: isLoaded ? 0 : 0.15,
                            transition: 'opacity 0.5s ease-out',
                          }}
                        />

                        {/* Optimized Image */}
                        <motion.img
                            srcSet={`${item.urls['290']} 290w, ${item.urls['580']} 580w, ${item.urls['1450']} 1450w, ${item.urls['originals']} 2000w`}
                            sizes={sizes}
                            src={item.urls['1450']}
                            alt=""
                            className="w-full h-full object-contain"
                            loading={isPriority ? "eager" : "lazy"}
                            {...(isPriority ? { fetchpriority: "high" } : {})}
                            onLoad={() => handleImageLoad(item.id)}
                            {...animations.imageFadeIn}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            {...animations.hoverScale}
                            style={{
                              ...gpuAcceleration,
                              ...imageOptimization,
                              willChange: isLoaded ? willChange.idle : willChange.loading,
                            }}
                        />
                    </div>
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default LivingGrid;