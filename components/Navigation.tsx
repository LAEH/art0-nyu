import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.REEL, icon: '🎞️', label: 'Reel' },
    { mode: AppMode.GRID, icon: '🍱', label: 'Grid' },
    { mode: AppMode.DECK, icon: '🃏', label: 'Deck' },
    { mode: AppMode.PLAYGROUND, icon: '🎨', label: 'Canvas' },
    { mode: AppMode.OVERVIEW, icon: '💠', label: 'Overview' },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        // Apple-style glass: semi-transparent white/gray, heavy blur, saturation boost, subtle border and shadow
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-[#e5e5e5]/40 backdrop-blur-3xl backdrop-saturate-150 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 ring-1 ring-white/10"
      >
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full text-xl sm:text-2xl transition-all duration-300 ${
              currentMode === item.mode
                ? 'bg-white shadow-md scale-110 text-opacity-100'
                : 'hover:bg-white/20 opacity-70 hover:opacity-100'
            }`}
            aria-label={item.label}
          >
            {item.icon}
            {currentMode === item.mode && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -bottom-1 w-1 h-1 bg-black/80 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default Navigation;