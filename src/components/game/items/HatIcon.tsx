import { motion } from "framer-motion";

interface HatIconProps {
  hatId: string;
  size?: string;
  large?: boolean;
}

export function HatIcon({ hatId, size = "w-6 h-6", large = false }: HatIconProps) {
  if (hatId.includes("mystic-ring") || hatId.includes("eternity")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <circle cx="16" cy="12" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
        <motion.circle 
          cx="16" cy="18" r="6" fill="#00B0FF" 
          animate={{ scale: [1, 1.1, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <path d="M12 12 L20 12 M16 8 L16 16" stroke="white" strokeWidth="1" opacity="0.5" />
      </svg>
    );
  }

  if (hatId.includes("holy-relic") || hatId.includes("sunlord")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <motion.circle 
          cx="16" cy="16" r="12" fill="none" stroke="#FFF176" strokeWidth="2" strokeDasharray="4 2"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
        <circle cx="16" cy="16" r="6" fill="#FFEE58" />
        <path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16" stroke="#FDD835" strokeWidth="2" />
      </svg>
    );
  }

  if (hatId.includes("warrior")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M8 12 Q16 2 24 12 L24 22 Q16 26 8 22 Z" fill="#90A4AE" />
        <rect x="10" y="14" width="12" height="4" fill="#546E7A" />
        <motion.circle 
          cx="16" cy="16" r="2" fill="#FFD700" 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </svg>
    );
  }

  if (hatId.includes("priest")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M10 24 Q16 4 22 24 Z" fill="#FFFFFF" stroke="#FFD700" strokeWidth="2" />
        <rect x="15" y="12" width="2" height="8" fill="#FFD700" />
        <rect x="12" y="15" width="8" height="2" fill="#FFD700" />
        <motion.circle 
          cx="16" cy="8" r="4" fill="none" stroke="#FFD700" strokeWidth="1.5"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
      <path d="M6 24 L26 24 L16 6 Z" fill="#7E57C2" />
      <rect x="8" y="22" width="16" height="4" fill="#5E35B1" rx="1" />
      <motion.circle 
        cx="16" cy="14" r="2" fill="#B39DDB" 
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  );
}
