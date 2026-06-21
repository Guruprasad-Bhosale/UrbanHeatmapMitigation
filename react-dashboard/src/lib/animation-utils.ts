import { Variants } from 'framer-motion'

// Fade in animations
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Scale animations
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
}

// Slide in animations
export const slideInFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
}

export const slideInFromTopVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export const slideInFromBottomVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

// Container animations with stagger
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

// Pulse animation
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

// Bounce animation
export const bounceVariants: Variants = {
  initial: { y: 0 },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Hover lift effect
export const liftVariants: Variants = {
  initial: { y: 0 },
  hover: { y: -8, transition: { duration: 0.2 } },
}

// Gradient animation
export const gradientVariants: Variants = {
  initial: {
    backgroundPosition: '0% 50%',
  },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Glow animation
export const glowVariants: Variants = {
  initial: { filter: 'drop-shadow(0 0 0px #00D9FF)' },
  glow: {
    filter: [
      'drop-shadow(0 0 0px #00D9FF)',
      'drop-shadow(0 0 10px #00D9FF)',
      'drop-shadow(0 0 0px #00D9FF)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

// Rotate animation
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  rotate: {
    rotate: 360,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Spring animation presets
export const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 15,
}

export const bouncySpringTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 10,
}

export const smoothSpringTransition = {
  type: 'spring' as const,
  stiffness: 60,
  damping: 20,
}

// Page transition
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

// Modal animation
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
}

// Backdrop animation
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}
