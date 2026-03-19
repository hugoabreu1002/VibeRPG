import { motion } from "framer-motion";

interface SkillIconProps {
  skill: "bolt" | "fireball" | "slash" | "strike" | "smite" | "holy" | "barrier" | "flee" | "defend";
  className?: string;
}

export function SkillIcon({ skill, className = "" }: SkillIconProps) {
  switch (skill) {
    case "bolt":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L12 14H6L26 30L22 18H28L16 2Z" fill="url(#bolt-grad)" />
          <defs>
            <linearGradient id="bolt-grad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "fireball":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="18" r="10" fill="url(#fire-grad)" />
          <path d="M16 2C16 2 8 10 8 18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18C24 10 16 2 16 2Z" fill="url(#fire-grad)" />
          <path d="M16 8C16 8 12 14 12 18C12 20.2091 13.7909 22 16 22C18.2091 22 20 20.2091 20 18C20 14 16 8 16 8Z" fill="#FDE68A" opacity="0.6" />
          <defs>
            <linearGradient id="fire-grad" x1="16" y1="2" x2="16" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "slash":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 26L26 6M26 6L20 6M26 6L26 12" stroke="url(#metal-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 28L10 22L12 24L6 30L4 28Z" fill="#78350F" />
          <defs>
            <linearGradient id="metal-grad" x1="6" y1="26" x2="26" y2="6" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#64748B" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "strike":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4C14 4 12 6 12 8V20L8 24L12 28L16 24L20 28L24 24L20 20V8C20 6 18 4 16 4Z" fill="url(#metal-grad-2)" />
          <rect x="14" y="24" width="4" height="6" fill="#78350F" />
          <path d="M10 10H22M10 14H22" stroke="#475569" strokeWidth="1" />
          <defs>
            <linearGradient id="metal-grad-2" x1="16" y1="4" x2="16" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F1F5F9" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "smite":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2V30M2 16H30" stroke="url(#holy-grad)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="16" cy="16" r="6" fill="url(#holy-grad)" />
          <path d="M10 10L22 22M22 10L10 22" stroke="url(#holy-grad)" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="holy-grad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "holy":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4C16 4 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 4 16 4Z" fill="url(#gold-grad)" />
          <path d="M16 12V24M10 18H22" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="gold-grad" x1="16" y1="4" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "barrier":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4L26 8V16C26 22 22 26 16 28C10 26 6 22 6 16V8L16 4Z" fill="url(#shield-grad)" stroke="#60A5FA" strokeWidth="2" />
          <path d="M12 12C12 12 14 10 16 10C18 10 20 12 20 12" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="shield-grad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="1" stopColor="#1E3A8A" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "defend":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4L26 8V16C26 22 22 26 16 28C10 26 6 22 6 16V8L16 4Z" fill="url(#metal-grad-3)" />
          <path d="M16 10V22M10 16H22" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="metal-grad-3" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#94A3B8" />
              <stop offset="1" stopColor="#334155" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "flee":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20L4 14M4 14L10 8M4 14H24C24 14 28 14 28 18C28 22 24 22 24 22" stroke="url(#flee-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="14" r="2" fill="#FFF" />
          <defs>
            <linearGradient id="flee-grad" x1="4" y1="14" x2="28" y2="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#94A3B8" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      );
    default:
      return null;
  }
}
