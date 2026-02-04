import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ART_INVENTORY } from './constants';
import { ArtItem, AppMode } from './types';
import LivingGrid from './components/LivingGrid'; 
import DetailOverlay from './components/DetailOverlay';
import Playground from './components/Playground';
import Navigation from './components/Navigation';
import Reel from './components/Reel';
import Deck from './components/Deck';
import Overview from './components/Overview';
import Logo from './components/Logo';
import LoadingScreen from './components/LoadingScreen';

// Shuffle utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.REEL); // Default to REEL (second button)
  const [displayedItems, setDisplayedItems] = useState<ArtItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArtItem | null>(null);

  useEffect(() => {
    // 1. Shuffle items immediately
    const shuffled = shuffleArray(ART_INVENTORY);
    setDisplayedItems(shuffled);

    // 2. Preload critical assets (First 6 items of Grid)
    const preloadImages = async () => {
      const promises = shuffled.slice(0, 6).map((item) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          // Preload the 1450 version as it's likely to be used on desktop or high-res mobile
          img.src = item.urls['1450'];
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't block if error
        });
      });
      await Promise.all(promises);
    };

    // 3. Minimum wait time for the "experience" + Preloading
    const minWaitPromise = new Promise(resolve => setTimeout(resolve, 2500));
    
    Promise.all([preloadImages(), minWaitPromise]).then(() => {
      setLoading(false);
    });

  }, []);

  const renderContent = () => {
    switch (mode) {
      case AppMode.GRID:
        return (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LivingGrid items={displayedItems} onSelect={setSelectedItem} />
          </motion.div>
        );
      case AppMode.REEL:
        return (
          <motion.div
             key="reel"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-10"
          >
             <Reel items={displayedItems} />
          </motion.div>
        );
      case AppMode.DECK:
        return (
          <motion.div
             key="deck"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.05 }}
             className="absolute inset-0 z-10"
          >
             <Deck items={shuffleArray(displayedItems)} />
          </motion.div>
        );
      case AppMode.PLAYGROUND:
        return (
          <motion.div
            key="playground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10" 
          >
            <Playground items={ART_INVENTORY} />
          </motion.div>
        );
      case AppMode.OVERVIEW:
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
          >
            <Overview items={ART_INVENTORY} onSelect={setSelectedItem} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 selection:bg-pink-200 selection:text-pink-900 overflow-hidden bg-[#f5f5f7]">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!loading && (
        <>
           {/* Detail Overlay Wrapper */}
          <div className="relative z-[200]">
            <DetailOverlay 
                selectedItem={selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
          </div>

          <Logo />

          <main className={`h-screen w-full ${[AppMode.PLAYGROUND, AppMode.OVERVIEW, AppMode.REEL, AppMode.DECK].includes(mode) ? 'p-0' : 'pt-6 px-2 md:px-8'} max-w-[2000px] mx-auto overflow-y-auto no-scrollbar`}>
            <style>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </main>

          <Navigation 
            currentMode={mode} 
            setMode={setMode} 
          />
        </>
      )}
    </div>
  );
};

export default App;