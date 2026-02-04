import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { ArtItem } from '../types';
import { animations, gpuAcceleration, imageOptimization, willChange } from '../motion';

interface DetailOverlayProps {
  selectedItem: ArtItem | null;
  onClose: () => void;
}

const DetailOverlay: React.FC<DetailOverlayProps> = ({ selectedItem, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Motion values for gestures
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Smooth springs for the values
  const xSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 400, damping: 30 });
  const scaleSpring = useSpring(scale, { stiffness: 400, damping: 30 });

  // Reset loaded state when item changes
  React.useEffect(() => {
    setIsLoaded(false);
    // Reset transforms
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [selectedItem?.id, x, y, scale]);

  // Gesture handling
  const bind = useGesture(
    {
      onDrag: ({ active, movement: [mx, my], velocity: [vx, vy], cancel }) => {
        // If zoomed in, allow panning (simple implementation)
        if (scale.get() > 1.1) {
          x.set(mx);
          y.set(my);
          return;
        }

        // Vertical drag handling (Swipe down to close)
        // Only allow dragging down mostly
        if (active) {
          // Add some resistance
          y.set(my * 0.8);
          // Allow slight horizontal movement but dampened
          x.set(mx * 0.5);

          // If dragged down significantly, trigger close
          if (my > 200) {
            cancel();
            onClose();
          }
        } else {
          // Released
          if (my > 100 || vy > 0.5) {
             // Velocity or distance enough to close?
             // Since we handled 'my > 200' in active, this catches fast flicks
             onClose();
          } else {
             // Reset
             x.set(0);
             y.set(0);
          }
        }
      },
      onPinch: ({ active, offset: [d] }) => {
        if (active) {
          // Map distance to scale. 'd' is accumulated distance
          // We assume d starts at 1 (using scale: 1 config in useGesture if supported, 
          // but better to just use the raw factor or calculate relative).
          // @use-gesture defaults: offset is accumulated.
          scale.set(d);
        } else {
          // Reset zoom on release (Instagram style) or keep it? 
          // User said "zoom in and out", usually implies ability to stay or reset.
          // Let's snap back to 1 for "Instagram" style quick inspection, 
          // or allow it to stay if we want to examine details.
          // For now, let's spring back to 1 if it's less than 1, 
          // and maybe keep it if it's > 1? 
          // Actually, standard "quick look" usually snaps back. 
          // But "zoom in" to read/explore usually stays.
          // Let's keep it but bound it.
          if (scale.get() < 1) scale.set(1);
          // if (scale.get() > 3) scale.set(3); // Optional max cap
        }
      },
    },
    {
      drag: {
         // Filter taps?
         filterTaps: true,
         // If we are zoomed, don't trigger the close logic as easily involved in the 'onDrag' above
      },
      pinch: { scaleBounds: { min: 0.5, max: 4 }, rubberband: true },
    }
  );

  if (!selectedItem) return null;

  // Get color for placeholder
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

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-2xl touch-none"
          onClick={onClose}
        >
          <motion.div
            layoutId={`card-${selectedItem.id}`}
            className="relative w-full h-full max-w-5xl max-h-[90vh] md:rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center touch-action-none"

            {...bind() as any}
            style={{ 
              x: xSpring, 
              y: ySpring, 
              scale: scaleSpring,
              ...gpuAcceleration 
            }}
          >
            {/* Colored Placeholder */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: getColorValue(selectedItem.meta.accent_color),
                opacity: isLoaded ? 0 : 0.15,
                transition: 'opacity 0.5s ease-out',
                borderRadius: 'inherit'
              }}
            />

            {/* High Quality Image with Progressive Loading */}
            <motion.img
              src={selectedItem.urls.originals}
              alt=""
              className="w-full h-full object-contain bg-transparent"
              onLoad={() => setIsLoaded(true)}
              {...animations.imageFadeIn}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              draggable={false} // Prevent browser native drag
              style={{
                ...gpuAcceleration,
                ...imageOptimization,
                willChange: isLoaded ? willChange.idle : willChange.loading,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailOverlay;