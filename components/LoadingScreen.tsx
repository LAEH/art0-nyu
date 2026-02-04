import React from 'react';
import { motion } from 'framer-motion';
import { animations, gpuAcceleration } from '../motion';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#f5f5f7] flex items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing Glow */}
        <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/10 rounded-full blur-2xl"
        />

        {/* Dark Glass Disk with Pulsing Animation */}
        <motion.div 
            className="relative w-24 h-24 rounded-full bg-[#050505] flex items-center justify-center overflow-hidden shadow-2xl z-10"
            {...animations.pulse}
            style={gpuAcceleration}
        >
            {/* Glossy Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/0 to-transparent pointer-events-none" />
            
            {/* Top Shine */}
            <div className="absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent blur-md pointer-events-none" />

            {/* Logo */}
            <img 
                src="https://storage.googleapis.com/art0-assets-v0/mixx/art0.svg"
                alt="Art0"
                className="relative w-12 h-12 object-contain filter brightness-0 invert opacity-90"
            />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;