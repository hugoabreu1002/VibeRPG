import { motion } from "framer-motion";

interface WeaponIconProps {
  weaponId: string;
  size?: string;
  large?: boolean;
}

export function WeaponIcon({ weaponId, size = "w-6 h-6", large = false }: WeaponIconProps) {
  if (weaponId.includes("fire-staff") || weaponId.includes("fireball")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <rect x="14" y="4" width="4" height="24" fill="#8B4513" />
        <motion.circle 
          cx="16" cy="6" r="8" fill="#FF4500" 
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <circle cx="16" cy="6" r="4" fill="#FFD700" />
        <path d="M12 6 Q16 -4 20 6" fill="none" stroke="#FFA500" strokeWidth="2" />
      </svg>
    );
  }

  if (weaponId.includes("silver-dagger") || weaponId.includes("whispers")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M16 4 L12 12 L16 28 L20 12 Z" fill="#E0F2F1" stroke="#80CBC4" strokeWidth="1" />
        <rect x="12" y="24" width="8" height="4" fill="#263238" />
        <circle cx="16" cy="30" r="2" fill="#00BFA5" />
        <motion.path 
          d="M14 8 L18 8" stroke="white" strokeWidth="1" strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </svg>
    );
  }

  if (weaponId.includes("sword") || weaponId.includes("blade")) {
    const isEpic = weaponId.includes("king") || weaponId.includes("shadow");
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <path d="M16 4 L13 12 L13 24 L16 26 L19 24 L19 12 Z" fill={isEpic ? "#B19CD9" : "#C0C0C0"} />
        <rect x="10" y="22" width="12" height="3" fill="#8B4513" />
        <rect x="13.5" y="25" width="5" height="5" fill="#5D4037" />
        <path d="M16 6 L14 12 L18 12 Z" fill="white" opacity="0.5" />
      </svg>
    );
  }

  if (weaponId.includes("mace")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <rect x="14" y="14" width="4" height="16" fill="#5D4037" />
        <g>
          <circle cx="16" cy="10" r="8" fill="#607D8B" />
          <path d="M12 6 L20 14" stroke="#455A64" strokeWidth="2" />
          <path d="M20 6 L12 14" stroke="#455A64" strokeWidth="2" />
          <circle cx="16" cy="10" r="3" fill="#90A4AE" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
      <rect x="14" y="4" width="4" height="24" fill="#8B4513" />
      <circle cx="16" cy="6" r="6" fill="#00CED1" />
      <circle cx="16" cy="6" r="2" fill="white" />
    </svg>
  );
}
