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
          <defs>
            <linearGradient id="bolt-grad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
            <filter id="bolt-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer glow */}
          <motion.path
            d="M16 2L12 14H6L26 30L22 18H28L16 2Z"
            fill="#60A5FA"
            opacity="0.3"
            filter="url(#bolt-glow)"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          {/* Main bolt */}
          <path d="M16 2L12 14H6L26 30L22 18H28L16 2Z" fill="url(#bolt-grad)" stroke="#93C5FD" strokeWidth="0.5" />
          {/* Inner highlight */}
          <path d="M16 6L13.5 13H9L23 26L20.5 19H25L16 6Z" fill="#DBEAFE" opacity="0.4" />
          {/* Spark particles */}
          <motion.circle cx="8" cy="16" r="1" fill="#93C5FD" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
          <motion.circle cx="24" cy="14" r="0.8" fill="#93C5FD" animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.5 }} />
          <motion.circle cx="14" cy="24" r="0.6" fill="#BFDBFE" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} />
        </svg>
      );
    case "fireball":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fire-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="30%" stopColor="#FCD34D" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </radialGradient>
            <radialGradient id="fire-outer" cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
            <filter id="fire-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer glow */}
          <motion.circle
            cx="16" cy="16" r="14"
            fill="#EF4444"
            opacity="0.3"
            filter="url(#fire-glow)"
            animate={{ r: [13, 15, 13], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          {/* Fire body */}
          <circle cx="16" cy="18" r="10" fill="url(#fire-outer)" />
          <path d="M16 4C16 4 8 12 8 18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18C24 12 16 4 16 4Z" fill="url(#fire-core)" />
          {/* Inner flames */}
          <motion.path
            d="M16 10Q12 16 16 22Q20 16 16 10"
            fill="#FEF3C7"
            animate={{ d: ["M16 10Q12 16 16 22Q20 16 16 10", "M16 8Q11 15 16 24Q21 15 16 8", "M16 10Q12 16 16 22Q20 16 16 10"] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {/* Flame wisps */}
          <motion.path
            d="M10 8Q8 4 12 6"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ d: ["M10 8Q8 4 12 6", "M10 6Q7 2 13 5", "M10 8Q8 4 12 6"] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.path
            d="M22 8Q24 4 20 6"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ d: ["M22 8Q24 4 20 6", "M22 6Q25 2 19 5", "M22 8Q24 4 20 6"] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          {/* Ember particles */}
          <motion.circle cx="10" cy="12" r="1.5" fill="#FCD34D" animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} />
          <motion.circle cx="22" cy="14" r="1" fill="#F59E0B" animate={{ y: [2, -2, 2], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
          <motion.circle cx="12" cy="22" r="0.8" fill="#FCD34D" animate={{ y: [-1, 1, -1], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
        </svg>
      );
    case "slash":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blade-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0E7FF" />
              <stop offset="30%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E0E7FF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="slash-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Slash trail */}
          <motion.path
            d="M4 28L28 4"
            stroke="url(#slash-trail)"
            strokeWidth="6"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          {/* Blade */}
          <path d="M6 26L26 6M26 6L20 6M26 6L26 12" stroke="url(#blade-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Blade edge highlight */}
          <path d="M7 25L25 7" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          {/* Handle */}
          <path d="M4 28L10 22L12 24L6 30L4 28Z" fill="#78350F" stroke="#451A03" strokeWidth="0.5" />
          {/* Handle wrap */}
          <path d="M5 27L9 23M6 28L10 24" stroke="#92400E" strokeWidth="0.5" />
          {/* Impact sparks */}
          <motion.circle cx="26" cy="6" r="2" fill="#F59E0B" animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 0.8 }} />
          <motion.circle cx="28" cy="4" r="1" fill="#FCD34D" animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
          <motion.circle cx="24" cy="8" r="0.8" fill="#FEF3C7" animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} />
        </svg>
      );
    case "strike":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hammer-head" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="30%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="hammer-handle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Impact effect */}
          <motion.circle
            cx="16" cy="26" r="8"
            fill="#F59E0B"
            opacity="0.4"
            animate={{ r: [6, 10, 6], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          {/* Handle */}
          <rect x="14" y="20" width="4" height="10" fill="url(#hammer-handle)" stroke="#451A03" strokeWidth="0.5" />
          {/* Handle grip */}
          <path d="M14 22L18 22M14 25L18 25M14 28L18 28" stroke="#5D4037" strokeWidth="0.8" />
          {/* Hammer head */}
          <path d="M10 4C8 4 6 6 6 8V18C6 20 8 22 10 22H22C24 22 26 20 26 18V8C26 6 24 4 22 4Z" fill="url(#hammer-head)" stroke="#475569" strokeWidth="1" />
          {/* Hammer face detail */}
          <rect x="8" y="16" width="16" height="4" fill="#94A3B8" stroke="#64748B" strokeWidth="0.5" />
          {/* Cross engraving */}
          <path d="M14 8V14M18 8V14M12 10H20" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Metal shine */}
          <path d="M8 6L10 6L10 12L8 12Z" fill="white" opacity="0.3" />
          {/* Impact sparks */}
          <motion.circle cx="12" cy="28" r="1.5" fill="#FCD34D" animate={{ y: [-2, 0, -2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
          <motion.circle cx="20" cy="27" r="1" fill="#F59E0B" animate={{ y: [-3, 1, -3], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
          <motion.circle cx="16" cy="29" r="0.8" fill="#FEF3C7" animate={{ y: [-1, 1, -1], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.5 }} />
        </svg>
      );
    case "smite":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="holy-beam" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <radialGradient id="holy-burst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <filter id="holy-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Divine light rays */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ transformOrigin: "16px 16px" }}
          >
            <path d="M16 2L18 10L16 8L14 10Z" fill="#FDE68A" opacity="0.4" />
            <path d="M30 16L22 18L24 16L22 14Z" fill="#FDE68A" opacity="0.4" />
            <path d="M16 30L14 22L16 24L18 22Z" fill="#FDE68A" opacity="0.4" />
            <path d="M2 16L10 14L8 16L10 18Z" fill="#FDE68A" opacity="0.4" />
          </motion.g>
          {/* Holy beams */}
          <motion.path
            d="M16 0V32"
            stroke="url(#holy-beam)"
            strokeWidth="6"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.path
            d="M0 16H32"
            stroke="url(#holy-beam)"
            strokeWidth="6"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          {/* Central burst */}
          <motion.circle
            cx="16" cy="16" r="8"
            fill="url(#holy-burst)"
            filter="url(#holy-glow)"
            animate={{ r: [6, 10, 6], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          {/* Cross pattern */}
          <path d="M16 8V24M8 16H24" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
          {/* Diagonal rays */}
          <path d="M10 10L22 22M22 10L10 22" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Sparkle particles */}
          <motion.circle cx="10" cy="8" r="1.5" fill="#FEF3C7" animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
          <motion.circle cx="22" cy="10" r="1" fill="#FDE68A" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} />
          <motion.circle cx="8" cy="22" r="1.2" fill="#FEF3C7" animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.5 }} />
          <motion.circle cx="24" cy="24" r="0.8" fill="#FDE68A" animate={{ scale: [0.7, 1, 0.7], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }} />
        </svg>
      );
    case "holy":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="holy-shield" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="40%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="holy-shield-outer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="divine-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer divine aura */}
          <motion.circle
            cx="16" cy="16" r="14"
            fill="#FDE68A"
            opacity="0.2"
            animate={{ r: [13, 15, 13], opacity: [0.15, 0.3, 0.15] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {/* Shield shape */}
          <path d="M16 2C10 2 4 6 4 12C4 20 16 30 16 30C16 30 28 20 28 12C28 6 22 2 16 2Z" fill="url(#holy-shield-outer)" stroke="#B45309" strokeWidth="1" />
          {/* Inner shield */}
          <path d="M16 6C11 6 7 9 7 14C7 20 16 27 16 27C16 27 25 20 25 14C25 9 21 6 16 6Z" fill="url(#holy-shield)" />
          {/* Holy cross */}
          <rect x="14" y="10" width="4" height="14" fill="#B45309" rx="1" />
          <rect x="10" y="14" width="12" height="4" fill="#B45309" rx="1" />
          {/* Cross inner glow */}
          <rect x="15" y="11" width="2" height="12" fill="#FDE68A" opacity="0.6" />
          <rect x="11" y="15" width="10" height="2" fill="#FDE68A" opacity="0.6" />
          {/* Divine sparkles */}
          <motion.circle cx="12" cy="8" r="1.5" fill="white" animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          <motion.circle cx="20" cy="10" r="1" fill="white" animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }} />
          <motion.circle cx="10" cy="20" r="1.2" fill="#FEF3C7" animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }} />
          <motion.circle cx="22" cy="18" r="0.8" fill="#FEF3C7" animate={{ scale: [0.7, 1, 0.7], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.6, delay: 0.7 }} />
        </svg>
      );
    case "barrier":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="barrier-shield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="barrier-edge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="barrier-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer glow */}
          <motion.path
            d="M16 2L28 6V16C28 24 22 28 16 30C10 28 4 24 4 16V6L16 2Z"
            fill="#3B82F6"
            opacity="0.2"
            filter="url(#barrier-glow)"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {/* Shield body */}
          <path d="M16 4L26 8V16C26 22 22 26 16 28C10 26 6 22 6 16V8L16 4Z" fill="url(#barrier-shield)" stroke="url(#barrier-edge)" strokeWidth="2" />
          {/* Inner shield pattern */}
          <path d="M16 8L22 10.5V16C22 20 19 23 16 24.5C13 23 10 20 10 16V10.5L16 8Z" fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          {/* Energy waves */}
          <motion.path
            d="M12 12C12 12 14 10 16 10C18 10 20 12 20 12"
            stroke="#FEF3C7"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ y: [-1, 1, -1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.path
            d="M10 16C10 16 13 14 16 14C19 14 22 16 22 16"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ y: [1, -1, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
          />
          {/* Central rune */}
          <circle cx="16" cy="16" r="3" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
          <path d="M15 14L17 14L16 18Z" fill="#60A5FA" />
          {/* Particle effects */}
          <motion.circle cx="8" cy="10" r="1" fill="#93C5FD" animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} />
          <motion.circle cx="24" cy="12" r="0.8" fill="#60A5FA" animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} />
          <motion.circle cx="10" cy="22" r="1.2" fill="#93C5FD" animate={{ scale: [0.4, 0.9, 0.4], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
        </svg>
      );
    case "defend":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="metal-shield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="30%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="shield-rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          {/* Shield body */}
          <path d="M16 4L26 8V16C26 22 22 26 16 28C10 26 6 22 6 16V8L16 4Z" fill="url(#metal-shield)" stroke="url(#shield-rim)" strokeWidth="2" />
          {/* Shield rim detail */}
          <path d="M16 6L24 9.5V16C24 20.5 20.5 24 16 25.5C11.5 24 8 20.5 8 16V9.5L16 6Z" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          {/* Cross pattern */}
          <rect x="14" y="10" width="4" height="12" fill="#64748B" rx="1" />
          <rect x="10" y="14" width="12" height="4" fill="#64748B" rx="1" />
          {/* Cross highlight */}
          <rect x="15" y="11" width="2" height="10" fill="#94A3B8" opacity="0.6" />
          <rect x="11" y="15" width="10" height="2" fill="#94A3B8" opacity="0.6" />
          {/* Rivets */}
          <circle cx="10" cy="10" r="1.5" fill="#475569" stroke="#64748B" strokeWidth="0.5" />
          <circle cx="22" cy="10" r="1.5" fill="#475569" stroke="#64748B" strokeWidth="0.5" />
          <circle cx="10" cy="22" r="1.5" fill="#475569" stroke="#64748B" strokeWidth="0.5" />
          <circle cx="22" cy="22" r="1.5" fill="#475569" stroke="#64748B" strokeWidth="0.5" />
          {/* Metal shine */}
          <path d="M8 8L12 8L10 12L8 8Z" fill="white" opacity="0.3" />
        </svg>
      );
    case "flee":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="motion-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
              <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          {/* Motion blur lines */}
          <motion.path
            d="M2 10H12"
            stroke="url(#motion-line)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ x: [-4, 0, -4], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.path
            d="M4 16H16"
            stroke="url(#motion-line)"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ x: [-6, 0, -6], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: 0.1 }}
          />
          <motion.path
            d="M2 22H14"
            stroke="url(#motion-line)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ x: [-5, 0, -5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.85, delay: 0.2 }}
          />
          {/* Arrow */}
          <motion.path
            d="M16 16L26 16M26 16L22 12M26 16L22 20"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          {/* Speed lines */}
          <motion.line x1="8" y1="8" x2="14" y2="8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" animate={{ x: [-2, 2, -2], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 0.7 }} />
          <motion.line x1="6" y1="24" x2="12" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" animate={{ x: [-3, 1, -3], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 0.75, delay: 0.15 }} />
          {/* Dust particles */}
          <motion.circle cx="6" cy="18" r="1.5" fill="#94A3B8" animate={{ x: [-4, 0, -4], opacity: [0, 0.6, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
          <motion.circle cx="8" cy="14" r="1" fill="#CBD5E1" animate={{ x: [-3, 1, -3], opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }} />
          <motion.circle cx="4" cy="20" r="0.8" fill="#94A3B8" animate={{ x: [-5, 0, -5], opacity: [0, 0.4, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }} />
        </svg>
      );
    default:
      return null;
  }
}