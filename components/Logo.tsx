import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    // Wrapper div handles the fixed positioning and centering.
    // This separates the CSS transform (-translate-x-1/2) from Framer Motion's transform animations.
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] pointer-events-none select-none flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -50, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
            {/* Dark Glass Disk - Increased darkness for 'very dark' look */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#050505]/95 backdrop-blur-3xl border border-white/5 shadow-[0_10px_40px_0_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden group">
                
                {/* Glossy Reflection Gradient - Subtle */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/0 to-transparent pointer-events-none" />
                
                {/* Top Shine */}
                <div className="absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-white/15 to-transparent blur-md pointer-events-none" />

                {/* The Logo - Forced to White */}
                <img 
                    src="https://storage.googleapis.com/art0-assets-v0/mixx/art0.svg"
                    alt="Art0"
                    className="relative w-8 h-8 md:w-9 md:h-9 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
            </div>
        </motion.div>
    </div>
  );
};

export default Logo;