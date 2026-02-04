import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArtItem } from '../types';
import { 
  animations, 
  gpuAcceleration, 
  willChange, 
  imageOptimization,
  durations,
  easings,
  isSafari 
} from '../motion';

interface ReelProps {
  items: ArtItem[];
}

const Reel: React.FC<ReelProps> = ({ items }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => new Set(prev).add(itemId));
  };

  return (
    <div className="w-full h-[100dvh] flex items-center overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 md:px-[25vw] lg:px-[50vw] gap-4 md:gap-12 no-scrollbar bg-[#f5f5f7]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {items.map((item, index) => {
        const shouldRotate = isMobile && item.category === 'Enveloppe';
        const isPriority = index < 3;
        const isLoaded = loadedImages.has(item.id);
        const staggered = animations.staggeredEntrance(index, isPriority);

        return (
          <motion.div
            key={`reel-${item.id}`}
            {...staggered}
            className="snap-center shrink-0 h-[85%] flex items-center justify-center relative group"
            style={gpuAcceleration}
          >
            <div className="relative h-full w-auto flex items-center justify-center">
              {/* Colored placeholder */}
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: item.meta.accent_color || '#e5e7eb',
                  opacity: isLoaded ? 0 : 0.1,
                  transition: 'opacity 0.5s ease-out',
                }}
              />

              <motion.img
                srcSet={`${item.urls['580']} 580w, ${item.urls['1450']} 1450w`}
                sizes="(max-width: 768px) 85vw, 40vw"
                src={item.urls['1450']} 
                alt=""
                className="max-h-full max-w-[85vw] md:max-w-[40vw] w-auto h-auto object-contain rounded-lg shadow-xl"
                draggable={false}
                loading={isPriority ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(item.id)}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isLoaded ? 1 : 0,
                  rotate: shouldRotate ? 90 : 0, 
                  scale: shouldRotate ? 1.3 : 1 
                }}
                whileHover={isSafari ? { 
                  scale: shouldRotate ? 1.35 : 1.01,
                  rotate: shouldRotate ? 90 : 0,
                  transition: { duration: durations.fast, ease: easings.snap }
                } : {}}
                transition={{ 
                  opacity: { duration: durations.slow, ease: easings.natural, delay: 0.1 },
                  rotate: { duration: durations.medium, ease: easings.snap },
                  scale: { duration: durations.medium, ease: easings.snap },
                }}
                style={{
                  ...gpuAcceleration,
                  ...imageOptimization,
                  willChange: isLoaded ? willChange.idle : willChange.loading,
                }}
              />
              
              <div 
                className="absolute -bottom-4 left-0 right-0 h-12 opacity-20 blur-xl rounded-full scale-90"
                style={{ backgroundColor: item.meta.accent_color }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Reel;