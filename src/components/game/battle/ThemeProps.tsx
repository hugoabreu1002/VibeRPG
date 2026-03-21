import { motion } from "framer-motion";

interface ThemePropProps {
  theme: string;
  color: string;
  index: number;
}

export function ThemeProp({ theme, color, index }: ThemePropProps) {
  const seed = index * 1337;
  
  switch (theme) {
    case 'magical':
    case 'undead':
      // Floating Ancient Runes
      return (
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 12 + (seed % 8), repeat: Infinity }}
          className="absolute text-2xl font-serif select-none pointer-events-none"
          style={{ color, left: `${10 + (seed % 80)}%`, top: `${20 + (seed % 60)}%` }}
        >
          {['ᛖ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'][seed % 7]}
        </motion.div>
      );
      
    case 'water':
    case 'ice':
      // Bubbles
      return (
        <motion.div
          animate={{ 
            y: [100, -100],
            x: [0, Math.sin(seed) * 20, 0],
            opacity: [0, 0.2, 0]
          }}
          transition={{ duration: 10 + (seed % 10), repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-white/20 blur-[1px] pointer-events-none"
          style={{ 
            width: 10 + (seed % 20), 
            height: 10 + (seed % 20), 
            left: `${seed % 100}%`, 
            bottom: '-10%',
            backgroundColor: color 
          }}
        />
      );
      
    case 'forest':
    case 'grassland':
      // Drifting Leaves
      return (
        <motion.svg
          viewBox="0 0 24 24"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 100, 200],
            rotate: [0, 180, 360],
            opacity: [0, 0.3, 0]
          }}
          transition={{ duration: 20 + (seed % 15), repeat: Infinity, ease: "linear" }}
          className="absolute w-8 h-8 pointer-events-none"
          style={{ left: `${seed % 100}%`, top: '-10%', fill: color }}
        >
          <path d="M17,8C8,10 5,16 5,16C5,16 9,15 14,12C19,9 21,2 21,2C21,2 17,2 14,3C11,4 4,8 4,8C4,8 10,9 13,8C16,7 21,2 21,2" />
        </motion.svg>
      );
      
    case 'fire':
    case 'boss':
      // Ember / Sparks
      return (
        <motion.div
          animate={{ 
            y: [0, -150],
            x: [0, (seed % 2 === 0 ? 30 : -30)],
            scale: [1, 0],
            opacity: [0.4, 0]
          }}
          transition={{ duration: 8 + (seed % 6), repeat: Infinity, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full blur-[1px] pointer-events-none"
          style={{ 
            backgroundColor: color, 
            left: `${20 + (seed % 60)}%`, 
            bottom: '20%',
            boxShadow: `0 0 10px ${color}`
          }}
        />
      );

    default:
      // Subtle Floating Dust
      return (
        <motion.div
          animate={{ 
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8 + (seed % 5), repeat: Infinity }}
          className="absolute w-1 h-1 bg-white/30 rounded-full blur-[2px] pointer-events-none"
          style={{ left: `${seed % 100}%`, top: `${seed % 100}%` }}
        />
      );
  }
}
