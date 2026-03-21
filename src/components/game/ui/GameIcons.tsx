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

export function QuestTabIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor" />
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

// --- CLASS ICONS ---

export function ClassWarriorIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 2l-2 2-9 9-2 5 5-2 9-9 2-2z" fill="#EF4444" />
      <path d="M12 12l-5-5M7 17l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ClassMageIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle 
        cx="12" cy="12" r="4" fill="#8B5CF6" 
        animate={{ filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ClassPriestIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M5 7h14" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function ClassRogueIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3 2.1l-1.4 1.4L4.8 10.6 2.1 13.3c-.4.4-.4 1 0 1.4l7.2 7.2c.4.4 1 .4 1.4 0l2.7-2.7 7.1-7.1 1.4-1.4c.4-.4.4-1 0-1.4l-7.2-7.2c-.4-.4-1-.4-1.4 0z" fill="#64748B" />
    </svg>
  );
}

// --- WORLD MAP TILE ICONS ---

export function TileTreeIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 14h16L12 2z" fill="#065F46" />
      <path d="M12 8l-6 10h12L12 8z" fill="#047857" />
      <rect x="11" y="18" width="2" height="4" fill="#78350F" />
    </svg>
  );
}

export function TileWaterIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path 
        d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" 
        stroke="#60A5FA" 
        strokeWidth="2" 
        strokeLinecap="round"
        animate={{ x: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.path 
        d="M2 16c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" 
        stroke="#3B82F6" 
        strokeWidth="2" 
        strokeLinecap="round"
        animate={{ x: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function TileMountainIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4l-8 16h16L12 4z" fill="#4B5563" />
      <path d="M12 4l-3 6 3 2 3-2-3-6z" fill="#F3F4F6" opacity="0.8" />
      <path d="M12 10l-4 10h8l-4-10z" fill="#374151" />
    </svg>
  );
}

export function TileHouseIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L4 10v11h16V10l-8-7z" fill="#92400E" />
      <path d="M12 3L4 10h16L12 3z" fill="#78350F" />
      <rect x="10" y="14" width="4" height="7" fill="#451A03" />
      <rect x="7" y="12" width="3" height="3" fill="#FDE68A" opacity="0.6" />
      <rect x="14" y="12" width="3" height="3" fill="#FDE68A" opacity="0.6" />
    </svg>
  );
}

export function TileCaveIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 20s-2-12-10-12S2 20 2 20h20z" fill="#1F2937" />
      <path d="M12 10c-4 0-6 10-6 10h12c0-10-2-10-6-10z" fill="#000000" />
    </svg>
  );
}

export function TileLavaIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="#7F1D1D" rx="2" />
      <motion.path 
        d="M4 12c2-2 4 2 6 0s4-2 6 0 4 2 6 0" 
        stroke="#EF4444" 
        strokeWidth="3" 
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
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
