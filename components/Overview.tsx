import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArtItem } from '../types';

interface OverviewProps {
  items: ArtItem[];
  onSelect: (item: ArtItem) => void;
}

const Overview: React.FC<OverviewProps> = ({ items, onSelect }) => {
  const randomizedItems = useMemo(() => [...items].sort(() => Math.random() - 0.5), [items]);
  
  const totalRatio = randomizedItems.reduce((acc, item) => acc + item.meta.ratio, 0);
  const screenRatio = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1;
  const containerRatio = screenRatio; 

  const K = Math.max(1, Math.round(Math.sqrt(totalRatio / containerRatio)));
  
  const rows: ArtItem[][] = Array.from({ length: K }, () => []);
  
  let currentRowIndex = 0;
  const targetRowWidth = totalRatio / K;
  let currentRowWidth = 0;
  
  randomizedItems.forEach(item => {
      if (currentRowWidth > targetRowWidth && currentRowIndex < K - 1) {
          currentRowIndex++;
          currentRowWidth = 0;
      }
      rows[currentRowIndex].push(item);
      currentRowWidth += item.meta.ratio;
  });

  return (
    // Responsive container - full size on mobile, oversized on desktop for panning effect
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black flex flex-col w-full h-full md:w-[120vw] md:h-[120vh] overflow-hidden">
        {rows.map((rowItems, idx) => (
            <div key={idx} className="flex w-full flex-1 min-h-0">
                {rowItems.map(item => (
                     <motion.div
                        key={`ov-${item.id}`}
                        style={{ flex: item.meta.ratio }} 
                        className="h-full relative cursor-pointer min-w-0"
                        whileHover={{ opacity: 0.8 }}
                        onClick={() => onSelect(item)}
                     >
                         {/* Performance: Use 580px or 290px thumbnails. Originals will crash the browser. */}
                         <img 
                            src={item.urls['580']}
                            srcSet={`${item.urls['290']} 290w, ${item.urls['580']} 580w`}
                            sizes="15vw" 
                            className="w-full h-full"
                            alt=""
                            loading="lazy"
                            decoding="async"
                         />
                     </motion.div>
                ))}
            </div>
        ))}
    </div>
  );
};

export default Overview;