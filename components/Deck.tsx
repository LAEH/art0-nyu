import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtItem } from '../types';
import { gpuAcceleration, durations, easings } from '../motion';

interface DeckProps {
  items: ArtItem[];
}

const Deck: React.FC<DeckProps> = ({ items }) => {
  const [deck, setDeck] = useState(items);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cycleCard = () => {
    setDeck((prev) => {
      const newDeck = [...prev];
      const topCard = newDeck.pop();
      if (topCard) {
        newDeck.unshift(topCard);
      }
      return newDeck;
    });
  };

  const visibleCards = deck.slice(-4); 

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center relative overflow-hidden bg-[#f5f5f7]">
      <div 
        className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000 ease-in-out scale-150"
        style={{ backgroundColor: visibleCards[visibleCards.length - 1]?.meta.accent_color || '#fff' }}
      />

      <div className="relative w-full max-w-md h-[60vh] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((item, index) => {
            const isTop = index === visibleCards.length - 1;
            const offset = visibleCards.length - 1 - index; 
            const shouldRotate = isMobile && item.category === 'Enveloppe';
            
            return (
              <motion.div
                key={item.id}
                layoutId={`deck-${item.id}`}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ 
                  scale: 1 - offset * 0.05, 
                  y: offset * -15, 
                  opacity: 1 - offset * 0.15,
                  zIndex: index
                }}
                exit={{ 
                  x: 200, 
                  opacity: 0, 
                  rotate: 10, 
                  transition: { duration: 0.2 } 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: isTop ? 'pointer' : 'default',
                  touchAction: 'none',
                  ...gpuAcceleration,
                }}
                onClick={isTop ? cycleCard : undefined}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 100) {
                    cycleCard();
                  }
                }}
              >
                <div className="relative w-[85%] h-full md:w-full p-4 bg-white rounded-3xl shadow-2xl border border-white/50 flex items-center justify-center overflow-hidden">
                  <motion.img
                    srcSet={`${item.urls['580']} 580w, ${item.urls['1450']} 1450w`}
                    sizes="(max-width: 768px) 85vw, 450px"
                    src={item.urls['1450']}
                    alt=""
                    className={`w-full h-full object-contain rounded-xl pointer-events-none bg-stone-50 ${shouldRotate ? 'rotate-90 scale-125' : ''}`}
                    decoding="async"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Desktop Navigation Arrows */}
      {!isMobile && (
        <>
          {/* Left Arrow */}
          <motion.button
            onClick={cycleCard}
            className="fixed left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black/40 hover:text-black/80 hover:bg-white/20 transition-all duration-200 shadow-lg z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: durations.medium, ease: easings.natural }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={gpuAcceleration}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

          {/* Right Arrow */}
          <motion.button
            onClick={cycleCard}
            className="fixed right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black/40 hover:text-black/80 hover:bg-white/20 transition-all duration-200 shadow-lg z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: durations.medium, ease: easings.natural }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={gpuAcceleration}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </>
      )}
    </div>
  );
};

export default Deck;