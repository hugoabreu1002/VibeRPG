import { motion } from "framer-motion";

interface ArmorIconProps {
  armorId: string;
  size?: string;
  large?: boolean;
}

export function ArmorIcon({ armorId, size = "w-6 h-6", large = false }: ArmorIconProps) {
  if (armorId.includes("steel-buckler") || armorId.includes("vanguard")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M16 4 L26 8 L24 24 L16 30 L8 24 L6 8 Z" fill="#78909C" stroke="#455A64" strokeWidth="1" />
        <path d="M16 8 L22 10 L20 22 L16 26 L12 22 L10 10 Z" fill="#B0BEC5" />
        <motion.circle 
          cx="16" cy="16" r="4" fill="#607D8B" 
          animate={{ fill: ["#607D8B", "#81D4FA", "#607D8B"] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </svg>
    );
  }

  if (armorId.includes("knight-armor") || armorId.includes("dreadnought")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <rect x="6" y="8" width="20" height="20" rx="2" fill="#37474F" />
        <rect x="8" y="10" width="16" height="16" rx="1" fill="#455A64" />
        <rect x="10" y="12" width="12" height="4" fill="#263238" />
        <motion.rect 
          x="12" y="18" width="8" height="2" fill="#FFD700" 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <path d="M6 8 L10 4 L22 4 L26 8" fill="#546E7A" />
      </svg>
    );
  }

  if (armorId.includes("divine-robes") || armorId.includes("ether-woven")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M8 8 L24 8 L28 28 L4 28 Z" fill="#5E35B1" />
        <motion.path 
          d="M12 8 L16 4 L20 8" fill="none" stroke="#D1C4E9" strokeWidth="1"
          animate={{ y: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <rect x="4" y="24" width="24" height="4" fill="#4527A0" />
        <motion.circle 
          cx="16" cy="18" r="6" fill="rgba(209, 196, 233, 0.2)" 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
      <path d="M8 6 L16 2 L24 6 L24 26 L8 26 Z" fill="#9370DB" />
      <path d="M12 10 L16 8 L20 10 L20 22 L12 22 Z" fill="#4B0082" />
    </svg>
  );
}
