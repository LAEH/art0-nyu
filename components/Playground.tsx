import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtItem } from '../types';

interface PlaygroundProps {
  items: ArtItem[];
}

const Playground: React.FC<PlaygroundProps> = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [screenRatio, setScreenRatio] = useState(typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1);
  const isMobile = screenRatio < 1;

  useEffect(() => {
    const handleResize = () => {
      setScreenRatio(window.innerWidth / window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const smartItems = useMemo(() => {
    const isLandscape = screenRatio > 1;
    return [...items].sort((a, b) => {
      const aScore = a.meta.orientation === (isLandscape ? 'landscape' : 'portrait') ? 1 : 0;
      const bScore = b.meta.orientation === (isLandscape ? 'landscape' : 'portrait') ? 1 : 0;
      return bScore - aScore;
    });
  }, [items, screenRatio]);

  const currentItem = smartItems[index % smartItems.length];
  const shouldRotate = isMobile && currentItem.category === 'Enveloppe';

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + smartItems.length) % smartItems.length);
  };

  const handleTap = () => {
    setBgIndex(prev => (prev + 1) % (currentItem.meta.palette.length || 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  const bgColor = currentItem?.meta.palette[bgIndex % currentItem.meta.palette.length] || currentItem?.meta.accent_color || '#fff';

  return (
    <motion.div 
        className="w-full h-screen fixed inset-0 flex flex-col items-center overflow-hidden touch-none justify-start md:justify-center"
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 1 }}
    >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />

        <AnimatePresence initial={false} custom={direction}>
        <motion.div
            key={currentItem.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
            }}
            className="absolute w-full h-full max-w-[95vw] max-h-[60vh] md:max-h-[85vh] flex items-center justify-center p-6 top-28 md:top-auto"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;

            if (swipe < -10000) {
                paginate(1);
            } else if (swipe > 10000) {
                paginate(-1);
            }
            }}
            onClick={handleTap}
        >
            <motion.img
            srcSet={`${currentItem.urls['580']} 580w, ${currentItem.urls['1450']} 1450w, ${currentItem.urls['originals']} 2000w`}
            sizes="100vw"
            src={currentItem.urls['1450']}
            alt=""
            className={`w-full h-full object-contain drop-shadow-2xl ${shouldRotate ? 'rotate-90 scale-[1.2]' : ''}`}
            draggable={false}
            decoding="async"
            />
        </motion.div>
        </AnimatePresence>
    </motion.div>
  );
};

export default Playground;