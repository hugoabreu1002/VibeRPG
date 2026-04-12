import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
  animate?: boolean;
}

// --- STAT ICONS ---

export function HealthIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#healthGradient)" />
      <defs>
        <linearGradient id="healthGradient" x1="2" y1="3" x2="2" y2="21.35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#991B1B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ManaIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" fill="url(#manaGradient)" />
      <defs>
        <linearGradient id="manaGradient" x1="4.5" y1="2" x2="4.5" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function XPIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#xpGradient)" />
      <defs>
        <linearGradient id="xpGradient" x1="2" y1="2" x2="2" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoldIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="1" />
      <path d="M12 7v10M9 9h6M9 15h6" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ShieldIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#312E81" stroke="#4F46E5" strokeWidth="1.5" />
      <path d="M12 2v19" stroke="#4F46E5" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

export function SwordIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 9l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 4l2 2-11 11-2 5 5-2 11-11 2-2z" fill="#94A3B8" />
      <path d="M18 4l2 2" stroke="#64748B" strokeWidth="2" />
      <path d="M7 17l2 2" stroke="#64748B" strokeWidth="3" />
    </svg>
  );
}

// --- TAB ICONS ---

export function MapTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill="currentColor" />
    </svg>
  );
}

export function WorldTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#0F172A" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 12h17" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      <path d="M12 3.5c2.6 2.1 4 5.2 4 8.5s-1.4 6.4-4 8.5c-2.6-2.1-4-5.2-4-8.5s1.4-6.4 4-8.5z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7.5c1.7 1 3.8 1.5 6 1.5s4.3-.5 6-1.5" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M6 16.5c1.7-1 3.8-1.5 6-1.5s4.3.5 6 1.5" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
    </svg>
  );
}

export function QuestTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor" />
    </svg>
  );
}

export function RankIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L9 7H3L7.5 11L6 17L12 13L18 17L16.5 11L21 7H15L12 1z" fill="currentColor" />
    </svg>
  );
}

export function InventoryTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8h-3V4H7v4H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-10h16v10z" fill="currentColor" />
    </svg>
  );
}

export function ShopTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H5v-4h7v4z" fill="currentColor" />
    </svg>
  );
}

export function GuildTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="url(#guildGradient)" stroke="#B45309" strokeWidth="1" />
      <path d="M12 6l-5 2.5v5L12 16l5-2.5v-5L12 6z" fill="#FDE68A" />
      <path d="M12 2v19M2 7l10 5 10-5" stroke="#B45309" strokeWidth="1" opacity="0.5" />
      <defs>
        <linearGradient id="guildGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- CLASS ICONS ---

export function ClassWarriorIcon({ className, size = 24 }: IconProps) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      ⚔️
    </span>
  );
}

export function ClassMageIcon({ className, size = 24 }: IconProps) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      🧙
    </span>
  );
}

export function ClassPriestIcon({ className, size = 24 }: IconProps) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      🙏
    </span>
  );
}

export function ClassRogueIcon({ className, size = 24 }: IconProps) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      🥷
    </span>
  );
}

export function ClassArcherIcon({ className, size = 24 }: IconProps) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      🏹
    </span>
  );
}

// --- WORLD MAP TILE ICONS ---

export function TileTreeIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="50%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Tree trunk with bark texture */}
      <rect x="14" y="20" width="4" height="10" fill="url(#trunkGrad)" stroke="#451A03" strokeWidth="0.5" />
      <line x1="15" y1="22" x2="15" y2="28" stroke="#451A03" strokeWidth="0.3" opacity="0.5" />
      <line x1="17" y1="21" x2="17" y2="27" stroke="#451A03" strokeWidth="0.3" opacity="0.5" />
      {/* Tree foliage layers */}
      <path d="M16 2 L6 14 L10 14 L4 20 L12 20 L8 26 L24 26 L20 20 L28 20 L22 14 L26 14 Z" fill="url(#treeGrad)" stroke="#064E3B" strokeWidth="0.5" />
      {/* Foliage highlights */}
      <path d="M16 4 L10 12 L14 12 L10 16 L16 16 L12 22 L20 22 L16 16 L22 16 L18 12 L22 12 Z" fill="#047857" opacity="0.6" />
      {/* Leaf details */}
      <circle cx="12" cy="10" r="1" fill="#10B981" opacity="0.5" />
      <circle cx="20" cy="12" r="1" fill="#10B981" opacity="0.5" />
      <circle cx="14" cy="18" r="1" fill="#10B981" opacity="0.5" />
      <circle cx="18" cy="16" r="1" fill="#10B981" opacity="0.5" />
    </svg>
  );
}

export function TileWaterIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="waterHighlight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Water base */}
      <rect x="2" y="8" width="28" height="22" rx="2" fill="url(#waterGrad)" />
      {/* Animated waves */}
      <motion.path
        d="M2 12c3-4 6-4 9 0s6 4 9 0 6-4 9 0v2c-3-4-6-4-9 0s-6 4-9 0-6-4-9 0z"
        fill="url(#waterHighlight)"
        animate={{ x: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.path
        d="M2 18c3-3 6-3 9 0s6 3 9 0 6-3 9 0v2c-3-3-6-3-9 0s-6 3-9 0-6-3-9 0z"
        fill="url(#waterHighlight)"
        animate={{ x: [3, -3, 3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.path
        d="M2 24c3-3 6-3 9 0s6 3 9 0 6-3 9 0v2c-3-3-6-3-9 0s-6 3-9 0-6-3-9 0z"
        fill="url(#waterHighlight)"
        animate={{ x: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      />
      {/* Light sparkles */}
      <motion.circle cx="8" cy="14" r="1" fill="white" opacity="0.6" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="20" cy="20" r="1" fill="white" opacity="0.6" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} />
      <motion.circle cx="14" cy="26" r="0.8" fill="white" opacity="0.5" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.8 }} />
    </svg>
  );
}

export function TileMountainIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="50%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      {/* Back mountain */}
      <path d="M4 28 L14 8 L24 28 Z" fill="#374151" stroke="#1F2937" strokeWidth="0.5" />
      {/* Front mountain */}
      <path d="M8 28 L18 6 L28 28 Z" fill="url(#mountainGrad)" stroke="#374151" strokeWidth="0.5" />
      {/* Snow cap */}
      <path d="M18 6 L14 12 L16 11 L18 14 L20 11 L22 12 Z" fill="url(#snowGrad)" stroke="#D1D5DB" strokeWidth="0.3" />
      {/* Rock details */}
      <path d="M12 20 L14 16 L16 20" fill="#4B5563" stroke="#374151" strokeWidth="0.3" />
      <path d="M20 22 L22 18 L24 22" fill="#4B5563" stroke="#374151" strokeWidth="0.3" />
      {/* Mountain ridge line */}
      <path d="M18 6 L14 12 L12 16 L10 20 L8 28" stroke="#6B7280" strokeWidth="0.5" opacity="0.5" />
      <path d="M18 6 L22 12 L24 18 L26 24 L28 28" stroke="#6B7280" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

export function TileHouseIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* House base/walls */}
      <rect x="6" y="16" width="20" height="14" fill="url(#wallGrad)" stroke="#B45309" strokeWidth="0.5" />
      {/* Roof */}
      <path d="M4 16 L16 6 L28 16 Z" fill="url(#roofGrad)" stroke="#451A03" strokeWidth="0.5" />
      {/* Roof texture */}
      <path d="M6 16 L16 8 L26 16" stroke="#92400E" strokeWidth="0.5" opacity="0.5" />
      <path d="M8 16 L16 10 L24 16" stroke="#92400E" strokeWidth="0.5" opacity="0.5" />
      {/* Door */}
      <rect x="13" y="22" width="6" height="8" fill="#78350F" stroke="#451A03" strokeWidth="0.5" />
      <circle cx="17.5" cy="26" r="0.8" fill="#F59E0B" />
      {/* Windows */}
      <rect x="8" y="19" width="4" height="4" fill="#60A5FA" stroke="#3B82F6" strokeWidth="0.5" />
      <rect x="20" y="19" width="4" height="4" fill="#60A5FA" stroke="#3B82F6" strokeWidth="0.5" />
      {/* Window cross bars */}
      <line x1="10" y1="19" x2="10" y2="23" stroke="#3B82F6" strokeWidth="0.3" />
      <line x1="8" y1="21" x2="12" y2="21" stroke="#3B82F6" strokeWidth="0.3" />
      <line x1="22" y1="19" x2="22" y2="23" stroke="#3B82F6" strokeWidth="0.3" />
      <line x1="20" y1="21" x2="24" y2="21" stroke="#3B82F6" strokeWidth="0.3" />
      {/* Window glow */}
      <motion.rect x="8" y="19" width="4" height="4" fill="#FDE68A" opacity="0.3" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} />
      <motion.rect x="20" y="19" width="4" height="4" fill="#FDE68A" opacity="0.3" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} />
      {/* Chimney */}
      <rect x="22" y="8" width="3" height="8" fill="#78350F" stroke="#451A03" strokeWidth="0.3" />
    </svg>
  );
}

export function TileCaveIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="caveGrad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#1F2937" />
        </radialGradient>
        <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
      </defs>
      {/* Rock formation */}
      <path d="M2 30 L2 12 Q2 4 10 4 L16 2 L22 4 Q30 4 30 12 L30 30 Z" fill="url(#rockGrad)" stroke="#111827" strokeWidth="0.5" />
      {/* Cave entrance */}
      <ellipse cx="16" cy="22" rx="10" ry="8" fill="url(#caveGrad)" />
      {/* Cave depth layers */}
      <ellipse cx="16" cy="24" rx="7" ry="5" fill="#000000" />
      <ellipse cx="16" cy="26" rx="4" ry="3" fill="#000000" />
      {/* Rock textures */}
      <path d="M4 10 L6 6 L10 8" stroke="#6B7280" strokeWidth="0.5" fill="none" />
      <path d="M28 10 L26 6 L22 8" stroke="#6B7280" strokeWidth="0.5" fill="none" />
      <circle cx="8" cy="14" r="1.5" fill="#374151" />
      <circle cx="24" cy="12" r="1" fill="#374151" />
      {/* Stalactites */}
      <path d="M10 4 L11 8 L12 4" fill="#4B5563" />
      <path d="M18 2 L19 7 L20 2" fill="#4B5563" />
      <path d="M14 4 L14.5 6 L15 4" fill="#4B5563" />
      {/* Glowing eyes in darkness */}
      <motion.circle cx="14" cy="22" r="1" fill="#EF4444" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="18" cy="22" r="1" fill="#EF4444" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
    </svg>
  );
}

export function TileLavaIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
        <radialGradient id="lavaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </radialGradient>
      </defs>
      {/* Lava base */}
      <rect width="32" height="32" fill="url(#lavaGrad)" rx="2" />
      {/* Lava surface texture */}
      <motion.path
        d="M0 8c4-2 8 2 12 0s8-2 12 0 8 2 8 0v4c-4 2-8-2-12 0s-8 2-12 0-8-2-8 0z"
        fill="url(#lavaGlow)"
        animate={{ y: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M0 18c4-2 8 2 12 0s8-2 12 0 8 2 8 0v4c-4 2-8-2-12 0s-8 2-12 0-8-2-8 0z"
        fill="url(#lavaGlow)"
        animate={{ y: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
      {/* Bubbles */}
      <motion.circle cx="8" cy="12" r="2" fill="#FCD34D" animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
      <motion.circle cx="22" cy="20" r="1.5" fill="#F59E0B" animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
      <motion.circle cx="14" cy="26" r="1" fill="#FCD34D" animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }} />
      {/* Sparks */}
      <motion.circle cx="6" cy="6" r="0.8" fill="#FBBF24" animate={{ y: [-4, 0, -4], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="26" cy="8" r="0.6" fill="#FBBF24" animate={{ y: [-3, 1, -3], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }} />
    </svg>
  );
}

// --- INDICATORS ---

export function ExclamationIndicator({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L12 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="12" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

export function DefeatIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#991B1B" />
      <path d="M7 14s1 2 5 2 5-2 5-2" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function VictoryIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#FBBF24" />
    </svg>
  );
}

export function SparkleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="#60A5FA" />
      <circle cx="18" cy="6" r="2" fill="#93C5FD" />
      <circle cx="6" cy="18" r="2" fill="#93C5FD" />
    </svg>
  );
}
