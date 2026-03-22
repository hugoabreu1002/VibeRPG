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
        <defs>
          <linearGradient id="steelShield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#90A4AE" />
            <stop offset="30%" stopColor="#CFD8DC" />
            <stop offset="50%" stopColor="#ECEFF1" />
            <stop offset="70%" stopColor="#CFD8DC" />
            <stop offset="100%" stopColor="#78909C" />
          </linearGradient>
          <radialGradient id="shieldCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#81D4FA" />
            <stop offset="100%" stopColor="#0288D1" />
          </radialGradient>
        </defs>
        {/* Shield base */}
        <path d="M16 2 L28 6 L26 22 L16 30 L6 22 L4 6 Z" fill="url(#steelShield)" stroke="#455A64" strokeWidth="1.5" />
        {/* Inner shield border */}
        <path d="M16 6 L24 9 L22 20 L16 26 L10 20 L8 9 Z" fill="none" stroke="#B0BEC5" strokeWidth="1" />
        {/* Shield face */}
        <path d="M16 8 L22 10 L20 18 L16 24 L12 18 L10 10 Z" fill="#546E7A" />
        {/* Central medallion */}
        <motion.circle
          cx="16" cy="14" r="5" fill="url(#shieldCenter)"
          animate={{ fill: ["url(#shieldCenter)", "#4FC3F7", "url(#shieldCenter)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        {/* Medallion detail */}
        <circle cx="16" cy="14" r="3" fill="#0288D1" />
        <circle cx="16" cy="14" r="1.5" fill="#81D4FA" />
        {/* Rivets */}
        <circle cx="10" cy="10" r="1" fill="#607D8B" stroke="#455A64" strokeWidth="0.3" />
        <circle cx="22" cy="10" r="1" fill="#607D8B" stroke="#455A64" strokeWidth="0.3" />
        <circle cx="10" cy="18" r="1" fill="#607D8B" stroke="#455A64" strokeWidth="0.3" />
        <circle cx="22" cy="18" r="1" fill="#607D8B" stroke="#455A64" strokeWidth="0.3" />
        {/* Edge highlights */}
        <path d="M16 3 L27 7" stroke="white" strokeWidth="0.5" opacity="0.4" />
        <path d="M16 3 L7 7" stroke="white" strokeWidth="0.5" opacity="0.4" />
      </svg>
    );
  }

  if (armorId.includes("knight-armor") || armorId.includes("dreadnought")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <defs>
          <linearGradient id="darkArmor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#455A64" />
            <stop offset="50%" stopColor="#263238" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>
          <linearGradient id="plateMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#37474F" />
            <stop offset="30%" stopColor="#546E7A" />
            <stop offset="50%" stopColor="#607D8B" />
            <stop offset="70%" stopColor="#546E7A" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>
        </defs>
        {/* Chest plate */}
        <rect x="4" y="6" width="24" height="22" rx="3" fill="url(#darkArmor)" stroke="#1A1A1A" strokeWidth="1" />
        {/* Plate overlay */}
        <rect x="6" y="8" width="20" height="18" rx="2" fill="url(#plateMetal)" stroke="#263238" strokeWidth="0.5" />
        {/* Shoulder guards */}
        <path d="M2 8 L6 6 L6 14 L2 12 Z" fill="#455A64" stroke="#263238" strokeWidth="0.5" />
        <path d="M30 8 L26 6 L26 14 L30 12 Z" fill="#455A64" stroke="#263238" strokeWidth="0.5" />
        {/* Chest emblem */}
        <path d="M16 10 L20 14 L18 20 L16 22 L14 20 L12 14 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
        {/* Emblem center */}
        <circle cx="16" cy="15" r="2" fill="#DAA520" />
        <circle cx="16" cy="15" r="1" fill="#FFD700" />
        {/* Belt */}
        <rect x="4" y="22" width="24" height="3" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
        {/* Belt buckle */}
        <motion.rect
          x="14" y="22" width="4" height="3" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5"
          animate={{ fill: ["#FFD700", "#FFA500", "#FFD700"] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        {/* Chain links */}
        <circle cx="8" cy="23.5" r="0.8" fill="#607D8B" />
        <circle cx="11" cy="23.5" r="0.8" fill="#607D8B" />
        <circle cx="21" cy="23.5" r="0.8" fill="#607D8B" />
        <circle cx="24" cy="23.5" r="0.8" fill="#607D8B" />
        {/* Neck guard */}
        <path d="M12 6 L16 4 L20 6 L20 8 L16 6 L12 8 Z" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
      </svg>
    );
  }

  if (armorId.includes("divine-robes") || armorId.includes("ether-woven")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <defs>
          <linearGradient id="divineFabric" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E1BEE7" />
            <stop offset="30%" stopColor="#CE93D8" />
            <stop offset="60%" stopColor="#AB47BC" />
            <stop offset="100%" stopColor="#7B1FA2" />
          </linearGradient>
          <radialGradient id="divineGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* Main robe */}
        <path d="M8 6 L24 6 L28 30 L4 30 Z" fill="url(#divineFabric)" stroke="#6A1B9A" strokeWidth="1" />
        {/* Robe overlay with glow */}
        <path d="M10 8 L22 8 L25 28 L7 28 Z" fill="url(#divineGlow)" />
        {/* Collar */}
        <path d="M10 6 L16 2 L22 6 L20 10 L16 8 L12 10 Z" fill="#E1BEE7" stroke="#CE93D8" strokeWidth="0.5" />
        {/* Collar gem */}
        <circle cx="16" cy="7" r="2" fill="#F48FB1" stroke="#EC407A" strokeWidth="0.5" />
        <circle cx="16" cy="6.5" r="0.8" fill="white" />
        {/* Embroidered patterns */}
        <motion.g
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <path d="M12 14 Q16 10 20 14" fill="none" stroke="#F48FB1" strokeWidth="1" />
          <path d="M12 18 Q16 14 20 18" fill="none" stroke="#F48FB1" strokeWidth="1" />
          <path d="M12 22 Q16 18 20 22" fill="none" stroke="#F48FB1" strokeWidth="1" />
        </motion.g>
        {/* Central star */}
        <motion.path
          d="M16 14 L17 16 L19 16 L17.5 17.5 L18 20 L16 18.5 L14 20 L14.5 17.5 L13 16 L15 16 Z"
          fill="#FFD700" stroke="#DAA520" strokeWidth="0.3"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        {/* Bottom trim */}
        <rect x="4" y="27" width="24" height="3" fill="#4A148C" stroke="#6A1B9A" strokeWidth="0.5" />
        {/* Trim pattern */}
        <circle cx="8" cy="28.5" r="0.8" fill="#CE93D8" />
        <circle cx="12" cy="28.5" r="0.8" fill="#CE93D8" />
        <circle cx="16" cy="28.5" r="0.8" fill="#CE93D8" />
        <circle cx="20" cy="28.5" r="0.8" fill="#CE93D8" />
        <circle cx="24" cy="28.5" r="0.8" fill="#CE93D8" />
        {/* Sleeves hint */}
        <path d="M4 8 L2 14 L6 14 L8 8" fill="#AB47BC" stroke="#7B1FA2" strokeWidth="0.5" />
        <path d="M28 8 L30 14 L26 14 L24 8" fill="#AB47BC" stroke="#7B1FA2" strokeWidth="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
      <defs>
        <linearGradient id="basicRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B39DDB" />
          <stop offset="50%" stopColor="#9575CD" />
          <stop offset="100%" stopColor="#7E57C2" />
        </linearGradient>
      </defs>
      {/* Main body */}
      <path d="M8 6 L24 6 L26 28 L6 28 Z" fill="url(#basicRobe)" stroke="#5E35B1" strokeWidth="1" />
      {/* Collar */}
      <path d="M10 6 L16 3 L22 6 L20 9 L16 7 L12 9 Z" fill="#9575CD" stroke="#7E57C2" strokeWidth="0.5" />
      {/* Belt */}
      <rect x="6" y="18" width="20" height="2" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
      {/* Belt knot */}
      <circle cx="16" cy="19" r="1.5" fill="#8B4513" stroke="#5D4037" strokeWidth="0.5" />
      {/* Robe pattern */}
      <line x1="10" y1="12" x2="10" y2="26" stroke="#7E57C2" strokeWidth="0.5" opacity="0.5" />
      <line x1="16" y1="10" x2="16" y2="26" stroke="#7E57C2" strokeWidth="0.5" opacity="0.5" />
      <line x1="22" y1="12" x2="22" y2="26" stroke="#7E57C2" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}