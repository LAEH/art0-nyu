/**
 * art0-NYU Motion System
 * Premium animation curves and timing for 60fps+ performance
 * Browser-adaptive with Safari Tier A / Chrome Tier B
 */

// Browser Detection
export const isSafari = typeof navigator !== 'undefined' && 
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isChrome = typeof navigator !== 'undefined' && 
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// Reduced motion preference
export const prefersReducedMotion = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * MOTION GRAMMAR
 * Consistent curves for the entire app
 */

// Easing Curves (cubic-bezier)
export const easings = {
  // Responsive UI snap - Fast ease-out, minimal tail
  snap: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // Natural arrival - Ease-in-out with soft landing
  natural: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  
  // Playful delight - Controlled overshoot
  playful: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  
  // Smooth exit - Gentle acceleration
  exit: [0.4, 0, 1, 1] as [number, number, number, number],
  
  // Entrance - Deceleration curve
  entrance: [0, 0, 0.2, 1] as [number, number, number, number],
};

// Spring Configurations
export const springs = {
  // Responsive - Quick settle, minimal bounce
  responsive: {
    stiffness: isSafari ? 400 : 350,
    damping: isSafari ? 30 : 35,
    mass: 0.8,
  },
  
  // Natural - Balanced motion
  natural: {
    stiffness: isSafari ? 300 : 250,
    damping: isSafari ? 25 : 30,
    mass: 1,
  },
  
  // Gentle - Soft, slow settle
  gentle: {
    stiffness: isSafari ? 200 : 180,
    damping: isSafari ? 20 : 25,
    mass: 1.2,
  },
  
  // Bouncy - Playful overshoot (Safari only)
  bouncy: {
    stiffness: isSafari ? 250 : 300,
    damping: isSafari ? 15 : 25,
    mass: 0.9,
  },
};

// Duration Scales (in seconds)
export const durations = {
  // Micro - UI feedback (100-200ms)
  micro: prefersReducedMotion ? 0 : (isSafari ? 0.15 : 0.12),
  
  // Fast - Small transitions (200-300ms)
  fast: prefersReducedMotion ? 0 : (isSafari ? 0.25 : 0.2),
  
  // Medium - Standard transitions (300-500ms)
  medium: prefersReducedMotion ? 0 : (isSafari ? 0.4 : 0.3),
  
  // Slow - Large transitions (500-800ms)
  slow: prefersReducedMotion ? 0 : (isSafari ? 0.7 : 0.5),
  
  // Luxe - Premium, deliberate (800ms+)
  luxe: prefersReducedMotion ? 0 : (isSafari ? 1 : 0.8),
};

/**
 * ANIMATION PRESETS
 * Ready-to-use animation configurations
 */

export const animations = {
  // Image fade-in (after load)
  imageFadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: durations.slow,
      ease: easings.natural,
      delay: 0.1, // Ensure full decode
    },
  },
  
  // Scroll reveal (whileInView)
  scrollReveal: (isPriority = false) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { 
      once: true, 
      margin: isPriority ? "0px" : "150px" 
    },
    transition: {
      duration: durations.medium,
      ease: easings.natural,
    },
  }),
  
  // Staggered entrance
  staggeredEntrance: (index: number, isPriority = false) => ({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: durations.medium,
      ease: easings.natural,
      delay: isPriority ? index * 0.08 : index * 0.04,
    },
  }),
  
  // Hover scale (Safari only for performance)
  hoverScale: isSafari && !prefersReducedMotion ? {
    whileHover: { 
      scale: 1.02,
      transition: { duration: durations.fast, ease: easings.snap }
    },
  } : {},
  
  // Page transition
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: durations.medium,
      ease: easings.natural,
    },
  },
  
  // Modal/Overlay
  modalOverlay: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: {
      type: "spring",
      ...springs.responsive,
    },
  },
  
  // Pulsing (loading, attention)
  pulse: {
    animate: {
      scale: [1, 1.08, 1],
      opacity: [0.7, 1, 0.7],
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1],
      repeatType: "reverse" as const,
    },
  },
};

/**
 * GPU ACCELERATION STYLES
 * Apply to all animated elements
 */
export const gpuAcceleration = {
  transform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden' as const,
  WebkitBackfaceVisibility: 'hidden' as const,
};

/**
 * WILL-CHANGE MANAGEMENT
 * Use sparingly, remove after animation
 */
export const willChange = {
  loading: 'opacity, transform',
  animating: 'transform',
  idle: 'auto',
};

/**
 * IMAGE RENDERING
 * Prevent progressive line-by-line rendering
 */
export const imageOptimization = {
  imageRendering: 'crisp-edges' as const,
  decoding: 'async' as const,
};

export default {
  easings,
  springs,
  durations,
  animations,
  gpuAcceleration,
  willChange,
  imageOptimization,
  isSafari,
  isChrome,
  isMobile,
  prefersReducedMotion,
};
