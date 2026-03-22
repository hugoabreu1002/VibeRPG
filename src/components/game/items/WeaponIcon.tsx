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
        {/* Wooden staff with grain */}
        <defs>
          <linearGradient id="woodGrain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D4C2A" />
            <stop offset="50%" stopColor="#8B5A2B" />
            <stop offset="100%" stopColor="#6D4C2A" />
          </linearGradient>
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFF00" />
            <stop offset="40%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF4500" />
          </radialGradient>
        </defs>
        <rect x="14" y="8" width="4" height="22" fill="url(#woodGrain)" stroke="#4A3520" strokeWidth="0.5" />
        {/* Wood grain detail */}
        <line x1="15" y1="10" x2="15" y2="28" stroke="#4A3520" strokeWidth="0.3" opacity="0.5" />
        <line x1="17" y1="12" x2="17" y2="26" stroke="#4A3520" strokeWidth="0.3" opacity="0.5" />
        {/* Fire orb with animation */}
        <motion.circle
          cx="16" cy="6" r="9" fill="url(#fireGlow)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        {/* Inner flame core */}
        <circle cx="16" cy="5" r="5" fill="#FFD700" />
        <circle cx="16" cy="4" r="3" fill="#FFFACD" />
        {/* Flame wisps */}
        <motion.path
          d="M10 6 Q8 2 12 4" stroke="#FF6347" strokeWidth="1.5" fill="none"
          animate={{ d: ["M10 6 Q8 2 12 4", "M10 6 Q7 3 12 5", "M10 6 Q8 2 12 4"] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.path
          d="M22 6 Q24 2 20 4" stroke="#FF6347" strokeWidth="1.5" fill="none"
          animate={{ d: ["M22 6 Q24 2 20 4", "M22 6 Q25 3 20 5", "M22 6 Q24 2 20 4"] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
        />
        {/* Metal binding */}
        <rect x="13" y="26" width="6" height="2" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
      </svg>
    );
  }

  if (weaponId.includes("silver-dagger") || weaponId.includes("whispers")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <defs>
          <linearGradient id="silverBlade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B0BEC5" />
            <stop offset="30%" stopColor="#ECEFF1" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#B0BEC5" />
          </linearGradient>
          <linearGradient id="darkHandle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#37474F" />
            <stop offset="100%" stopColor="#263238" />
          </linearGradient>
        </defs>
        {/* Blade with fuller */}
        <path d="M16 2 L13 10 L13 22 L16 28 L19 22 L19 10 Z" fill="url(#silverBlade)" stroke="#90A4AE" strokeWidth="0.5" />
        {/* Fuller groove */}
        <line x1="16" y1="6" x2="16" y2="20" stroke="#CFD8DC" strokeWidth="1" />
        {/* Crossguard */}
        <rect x="10" y="22" width="12" height="2" fill="url(#darkHandle)" stroke="#1A1A1A" strokeWidth="0.5" />
        <circle cx="10" cy="23" r="1.5" fill="#00ACC1" />
        <circle cx="22" cy="23" r="1.5" fill="#00ACC1" />
        {/* Wrapped handle */}
        <rect x="14" y="24" width="4" height="6" fill="url(#darkHandle)" />
        <line x1="14" y1="25" x2="18" y2="25" stroke="#1A1A1A" strokeWidth="0.5" />
        <line x1="14" y1="27" x2="18" y2="27" stroke="#1A1A1A" strokeWidth="0.5" />
        <line x1="14" y1="29" x2="18" y2="29" stroke="#1A1A1A" strokeWidth="0.5" />
        {/* Pommel */}
        <circle cx="16" cy="31" r="2" fill="#37474F" stroke="#00ACC1" strokeWidth="0.5" />
        {/* Shimmer effect */}
        <motion.path
          d="M15 6 L17 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
      </svg>
    );
  }

  if (weaponId.includes("sword") || weaponId.includes("blade")) {
    const isEpic = weaponId.includes("king") || weaponId.includes("shadow");
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <defs>
          <linearGradient id={isEpic ? "epicBlade" : "steelBlade"} x1="0" y1="0" x2="1" y2="0">
            {isEpic ? (
              <>
                <stop offset="0%" stopColor="#7B68EE" />
                <stop offset="30%" stopColor="#B19CD9" />
                <stop offset="50%" stopColor="#E6E6FA" />
                <stop offset="70%" stopColor="#B19CD9" />
                <stop offset="100%" stopColor="#7B68EE" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#9E9E9E" />
                <stop offset="30%" stopColor="#E0E0E0" />
                <stop offset="50%" stopColor="#FAFAFA" />
                <stop offset="70%" stopColor="#E0E0E0" />
                <stop offset="100%" stopColor="#9E9E9E" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* Blade with central ridge */}
        <path d="M16 2 L12 10 L12 22 L16 26 L20 22 L20 10 Z" fill={`url(#${isEpic ? "epicBlade" : "steelBlade"})`} stroke={isEpic ? "#9370DB" : "#757575"} strokeWidth="0.5" />
        {/* Fuller */}
        <line x1="16" y1="5" x2="16" y2="20" stroke={isEpic ? "#DDA0DD" : "#BDBDBD"} strokeWidth="1.5" />
        {/* Edge highlight */}
        <path d="M13 8 L13 21" stroke="white" strokeWidth="0.5" opacity="0.6" />
        {/* Crossguard with gems */}
        <rect x="9" y="22" width="14" height="3" fill="#8B4513" stroke="#5D4037" strokeWidth="0.5" />
        <circle cx="11" cy="23.5" r="1.2" fill={isEpic ? "#FFD700" : "#F44336"} />
        <circle cx="21" cy="23.5" r="1.2" fill={isEpic ? "#FFD700" : "#F44336"} />
        {/* Wrapped handle */}
        <rect x="14" y="25" width="4" height="5" fill="#5D4037" />
        <path d="M14 26 L18 26 M14 28 L18 28 M14 30 L18 30" stroke="#3E2723" strokeWidth="0.8" />
        {/* Pommel */}
        <circle cx="16" cy="31" r="2" fill={isEpic ? "#9370DB" : "#607D8B"} stroke={isEpic ? "#7B68EE" : "#455A64"} strokeWidth="0.5" />
        {isEpic && (
          <motion.circle cx="16" cy="31" r="1" fill="#E6E6FA" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        )}
      </svg>
    );
  }

  if (weaponId.includes("mace")) {
    return (
      <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
        <defs>
          <linearGradient id="metalHead" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78909C" />
            <stop offset="50%" stopColor="#B0BEC5" />
            <stop offset="100%" stopColor="#546E7A" />
          </linearGradient>
        </defs>
        {/* Wooden handle with grip */}
        <rect x="14" y="16" width="4" height="14" fill="#6D4C2A" stroke="#4A3520" strokeWidth="0.5" />
        <path d="M14 18 L18 18 M14 21 L18 21 M14 24 L18 24 M14 27 L18 27" stroke="#3E2723" strokeWidth="0.8" />
        {/* Metal head */}
        <g>
          <circle cx="16" cy="8" r="9" fill="url(#metalHead)" stroke="#455A64" strokeWidth="1" />
          {/* Spikes */}
          <polygon points="16,0 15,4 17,4" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
          <polygon points="16,16 15,12 17,12" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
          <polygon points="8,8 12,7 12,9" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
          <polygon points="24,8 20,7 20,9" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
          {/* Cross pattern */}
          <line x1="12" y1="4" x2="20" y2="12" stroke="#546E7A" strokeWidth="1.5" />
          <line x1="20" y1="4" x2="12" y2="12" stroke="#546E7A" strokeWidth="1.5" />
          {/* Center medallion */}
          <circle cx="16" cy="8" r="3" fill="#90A4AE" stroke="#607D8B" strokeWidth="0.5" />
          <circle cx="16" cy="8" r="1.5" fill="#B0BEC5" />
        </g>
        {/* Metal collar */}
        <rect x="13" y="14" width="6" height="3" fill="#607D8B" stroke="#455A64" strokeWidth="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={large ? "w-16 h-16" : size}>
      <defs>
        <linearGradient id="defaultBlade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#90A4AE" />
          <stop offset="50%" stopColor="#ECEFF1" />
          <stop offset="100%" stopColor="#90A4AE" />
        </linearGradient>
        <radialGradient id="gemGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="100%" stopColor="#008B8B" />
        </radialGradient>
      </defs>
      {/* Blade */}
      <path d="M16 2 L13 10 L13 22 L16 26 L19 22 L19 10 Z" fill="url(#defaultBlade)" stroke="#607D8B" strokeWidth="0.5" />
      <line x1="16" y1="5" x2="16" y2="20" stroke="#B0BEC5" strokeWidth="1" />
      {/* Guard */}
      <rect x="10" y="22" width="12" height="2" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
      {/* Handle */}
      <rect x="14" y="24" width="4" height="5" fill="#8B4513" />
      <path d="M14 25 L18 25 M14 27 L18 27" stroke="#5D4037" strokeWidth="0.5" />
      {/* Gem in pommel */}
      <circle cx="16" cy="30" r="2" fill="url(#gemGlow)" stroke="#008B8B" strokeWidth="0.5" />
      <motion.circle cx="16" cy="30" r="1" fill="white" opacity="0.8" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} />
    </svg>
  );
}