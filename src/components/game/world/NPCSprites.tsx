import React from 'react';
import { motion } from 'framer-motion';

interface NPCSpriteProps {
  type: string;
  className?: string;
}

export const NPCSprite: React.FC<NPCSpriteProps> = ({ type, className = "" }) => {
  switch (type) {
    case 'elder':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M22 28 Q20 40 24 50 L40 50 Q44 40 42 28" fill="#E5E7EB" />
          <path d="M24 30 Q22 42 26 48 L38 48 Q42 42 40 30" fill="#D1D5DB" />
          <circle cx="32" cy="22" r="12" fill="#FDE68A" />
          <circle cx="32" cy="22" r="11" fill="#FEF3C7" />
          <path d="M24 20 Q26 18 28 20" stroke="#D97706" strokeWidth="0.5" fill="none" />
          <path d="M36 20 Q38 18 40 20" stroke="#D97706" strokeWidth="0.5" fill="none" />
          <ellipse cx="27" cy="21" rx="2.5" ry="2" fill="#1E293B" />
          <ellipse cx="37" cy="21" rx="2.5" ry="2" fill="#1E293B" />
          <circle cx="27.5" cy="20.5" r="0.8" fill="white" />
          <circle cx="37.5" cy="20.5" r="0.8" fill="white" />
          <path d="M24 18 Q27 16 30 18" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          <path d="M34 18 Q37 16 40 18" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          <path d="M32 22 L31 25 L33 25" stroke="#D97706" strokeWidth="0.8" fill="none" />
          <path d="M28 28 Q32 31 36 28" stroke="#92400E" strokeWidth="1" fill="none" />
          <path d="M18 20 Q32 8 46 20 L48 55 Q32 60 16 55 Z" fill="#4B5563" />
          <path d="M20 22 Q32 12 44 22 L46 53 Q32 57 18 53 Z" fill="#374151" />
          <path d="M22 20 Q32 14 42 20 L40 28 Q32 24 24 28 Z" fill="#1F2937" opacity="0.5" />
          <path d="M20 45 L44 45" stroke="#F59E0B" strokeWidth="2" />
          <path d="M18 50 L46 50" stroke="#F59E0B" strokeWidth="1" />
          <rect x="48" y="25" width="3" height="35" fill="#78350F" />
          <circle cx="49.5" cy="22" r="4" fill="#8B5CF6" />
          <circle cx="49.5" cy="22" r="2" fill="#A78BFA" className="animate-pulse" />
        </svg>
      );
    case 'guard':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M22 12 L42 12 L44 24 L20 24 Z" fill="#6B7280" />
          <path d="M24 12 L40 12 L38 8 L26 8 Z" fill="#9CA3AF" />
          <rect x="20" y="20" width="24" height="4" fill="#4B5563" />
          <path d="M32 8 Q36 4 32 0 Q28 4 32 8" fill="#EF4444" />
          <path d="M32 8 L32 2" stroke="#DC2626" strokeWidth="2" />
          <rect x="26" y="16" width="12" height="10" fill="#FDBA74" />
          <rect x="24" y="18" width="16" height="4" fill="#1F2937" />
          <circle cx="29" cy="20" r="1.5" fill="#60A5FA" />
          <circle cx="35" cy="20" r="1.5" fill="#60A5FA" />
          <path d="M24 22 L22 28 L42 28 L40 22" fill="#4B5563" />
          <path d="M18 30 L46 30 L44 60 L20 60 Z" fill="#374151" />
          <path d="M20 32 L44 32 L42 58 L22 58 Z" fill="#1E293B" />
          <path d="M24 34 L40 34 L38 50 L26 50 Z" fill="#4B5563" />
          <path d="M26 36 L38 36 L37 48 L27 48 Z" fill="#6B7280" />
          <circle cx="32" cy="42" r="4" fill="#F59E0B" />
          <path d="M30 42 L32 39 L34 42 L32 45 Z" fill="#B45309" />
          <ellipse cx="18" cy="32" rx="5" ry="4" fill="#4B5563" />
          <ellipse cx="46" cy="32" rx="5" ry="4" fill="#4B5563" />
          <rect x="50" y="15" width="3" height="45" fill="#78350F" />
          <path d="M48 15 L51.5 5 L55 15 Z" fill="#9CA3AF" />
          <path d="M49 15 L51.5 8 L54 15 Z" fill="#D1D5DB" />
        </svg>
      );
    case 'merchant':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M20 18 Q32 8 44 18 Q44 28 32 26 Q20 28 20 18" fill="#F59E0B" />
          <path d="M22 20 Q32 12 42 20 Q42 26 32 24 Q22 26 22 20" fill="#FBBF24" />
          <circle cx="32" cy="15" r="3" fill="#EF4444" />
          <circle cx="32" cy="15" r="1.5" fill="#FCA5A5" />
          <circle cx="32" cy="28" r="10" fill="#FDBA74" />
          <circle cx="32" cy="28" r="9" fill="#FED7AA" />
          <path d="M26 30 Q28 28 32 30 Q36 28 38 30" stroke="#78350F" strokeWidth="2" fill="none" />
          <path d="M24 30 Q26 28 28 30" stroke="#78350F" strokeWidth="1.5" fill="none" />
          <path d="M36 30 Q38 28 40 30" stroke="#78350F" strokeWidth="1.5" fill="none" />
          <ellipse cx="28" cy="26" rx="2" ry="2.5" fill="#1E293B" />
          <ellipse cx="36" cy="26" rx="2" ry="2.5" fill="#1E293B" />
          <circle cx="28.5" cy="25.5" r="0.8" fill="white" />
          <circle cx="36.5" cy="25.5" r="0.8" fill="white" />
          <ellipse cx="32" cy="29" rx="1.5" ry="2" fill="#F97316" opacity="0.5" />
          <path d="M28 33 Q32 36 36 33" stroke="#92400E" strokeWidth="1.2" fill="none" />
          <path d="M20 38 Q32 35 44 38 L48 60 L16 60 Z" fill="#065F46" />
          <path d="M22 40 Q32 37 42 40 L45 58 L19 58 Z" fill="#047857" />
          <rect x="18" y="45" width="28" height="4" fill="#B45309" />
          <rect x="30" y="44" width="8" height="6" fill="#F59E0B" />
          <path d="M16 40 L10 52 L16 52 L20 42 Z" fill="#065F46" />
          <path d="M48 40 L54 52 L48 52 L44 42 Z" fill="#065F46" />
          <circle cx="8" cy="48" r="6" fill="#9CA3AF" />
          <rect x="6" y="42" width="4" height="12" fill="#6B7280" />
          <rect x="2" y="44" width="12" height="2" fill="#D1D5DB" />
          <circle cx="2" cy="48" r="3" fill="#FBBF24" />
          <circle cx="14" cy="48" r="3" fill="#FBBF24" />
        </svg>
      );
    case 'wizard':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M20 22 L44 22 L32 2 Z" fill="#4C1D95" />
          <path d="M22 22 L42 22 L32 6 Z" fill="#5B21B6" />
          <path d="M24 22 L40 22 L32 10 Z" fill="#6D28D9" />
          <circle cx="32" cy="12" r="2" fill="#FBBF24" />
          <circle cx="28" cy="16" r="1" fill="#FDE68A" />
          <circle cx="36" cy="18" r="1.5" fill="#FDE68A" />
          <ellipse cx="32" cy="24" rx="14" ry="3" fill="#3B0764" />
          <circle cx="32" cy="30" r="9" fill="#DDD6FE" />
          <circle cx="32" cy="30" r="8" fill="#EDE9FE" />
          <path d="M26 35 Q24 45 28 55 L36 55 Q40 45 38 35" fill="#E5E7EB" />
          <path d="M28 37 Q26 47 30 53 L34 53 Q38 47 36 37" fill="#F3F4F6" />
          <ellipse cx="28" cy="28" rx="3" ry="2.5" fill="#1E293B" />
          <ellipse cx="36" cy="28" rx="3" ry="2.5" fill="#1E293B" />
          <circle cx="29" cy="27.5" r="1" fill="#A78BFA" />
          <circle cx="37" cy="27.5" r="1" fill="#A78BFA" />
          <circle cx="29.5" cy="27" r="0.4" fill="white" />
          <circle cx="37.5" cy="27" r="0.4" fill="white" />
          <path d="M24 25 Q28 22 32 25" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          <path d="M32 25 Q36 22 40 25" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          <path d="M32 30 L30 34 L34 34" stroke="#A78BFA" strokeWidth="0.8" fill="none" />
          <path d="M20 38 Q32 34 44 38 L50 62 L14 62 Z" fill="#5B21B6" />
          <path d="M22 40 Q32 36 42 40 L47 60 L17 60 Z" fill="#6D28D9" />
          <path d="M14 58 L50 58" stroke="#FBBF24" strokeWidth="2" />
          <path d="M16 62 L48 62" stroke="#FBBF24" strokeWidth="1" />
          <circle cx="25" cy="48" r="1.5" fill="#FDE68A" />
          <circle cx="39" cy="52" r="1" fill="#FDE68A" />
          <circle cx="32" cy="45" r="2" fill="#FBBF24" />
          <path d="M14 42 L6 56 L14 58 L20 44 Z" fill="#5B21B6" />
          <path d="M50 42 L58 56 L50 58 L44 44 Z" fill="#5B21B6" />
          <rect x="56" y="20" width="3" height="42" fill="#78350F" />
          <circle cx="57.5" cy="16" r="6" fill="#8B5CF6" />
          <circle cx="57.5" cy="16" r="4" fill="#A78BFA" />
          <circle cx="57.5" cy="16" r="2" fill="#C4B5FD" className="animate-pulse" />
          <circle cx="52" cy="12" r="1" fill="#FDE68A" className="animate-pulse" />
          <circle cx="62" cy="18" r="0.8" fill="#FDE68A" className="animate-pulse" />
          <circle cx="54" cy="22" r="0.6" fill="#FDE68A" className="animate-pulse" />
        </svg>
      );
    case 'knight':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M22 8 L42 8 L46 26 L18 26 Z" fill="#9CA3AF" />
          <path d="M24 8 L40 8 L42 24 L22 24 Z" fill="#D1D5DB" />
          <rect x="22" y="16" width="20" height="6" fill="#4B5563" />
          <rect x="24" y="17" width="16" height="4" fill="#1F2937" />
          <rect x="26" y="18" width="4" height="2" fill="#60A5FA" />
          <rect x="34" y="18" width="4" height="2" fill="#60A5FA" />
          <path d="M32 8 L32 2 L28 6 L32 4 L36 6 Z" fill="#EF4444" />
          <path d="M30 4 L34 4" stroke="#B91C1C" strokeWidth="1" />
          <ellipse cx="32" cy="6" rx="3" ry="2" fill="#6B7280" />
          <path d="M16 28 L48 28 L46 62 L18 62 Z" fill="#6B7280" />
          <path d="M18 30 L46 30 L44 60 L20 60 Z" fill="#9CA3AF" />
          <path d="M24 32 L40 32 L38 48 L26 48 Z" fill="#D1D5DB" />
          <path d="M26 34 L38 34 L37 46 L27 46 Z" fill="#E5E7EB" />
          <circle cx="32" cy="40" r="5" fill="#F59E0B" />
          <path d="M29 38 Q32 35 35 38 Q36 42 32 44 Q28 42 29 38" fill="#B45309" />
          <path d="M14 28 L20 28 L18 40 L10 38 Z" fill="#9CA3AF" />
          <path d="M50 28 L44 28 L46 40 L54 38 Z" fill="#9CA3AF" />
          <ellipse cx="14" cy="32" rx="4" ry="3" fill="#D1D5DB" />
          <ellipse cx="50" cy="32" rx="4" ry="3" fill="#D1D5DB" />
          <rect x="18" y="48" width="28" height="4" fill="#78350F" />
          <rect x="30" y="47" width="8" height="6" fill="#F59E0B" />
          <path d="M18 28 L12 62 L22 60 L20 28 Z" fill="#DC2626" />
          <path d="M46 28 L52 62 L42 60 L44 28 Z" fill="#DC2626" />
          <rect x="54" y="20" width="4" height="36" fill="#9CA3AF" />
          <rect x="52" y="54" width="8" height="4" fill="#78350F" />
          <path d="M54 20 L56 10 L58 20 Z" fill="#E5E7EB" />
          <rect x="55" y="18" width="2" height="4" fill="#D1D5DB" />
        </svg>
      );
    case 'priest':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <ellipse cx="32" cy="10" rx="10" ry="3" fill="#FDE68A" opacity="0.8" />
          <ellipse cx="32" cy="10" rx="8" ry="2" fill="#FBBF24" />
          <circle cx="32" cy="22" r="10" fill="#FEE2E2" />
          <circle cx="32" cy="22" r="9" fill="#FECACA" />
          <ellipse cx="28" cy="21" rx="2" ry="1.5" fill="#1E293B" />
          <ellipse cx="36" cy="21" rx="2" ry="1.5" fill="#1E293B" />
          <circle cx="28.5" cy="20.5" r="0.6" fill="white" />
          <circle cx="36.5" cy="20.5" r="0.6" fill="white" />
          <path d="M26 20 Q28 19 30 20" stroke="#FCA5A5" strokeWidth="0.5" fill="none" />
          <path d="M34 20 Q36 19 38 20" stroke="#FCA5A5" strokeWidth="0.5" fill="none" />
          <path d="M29 26 Q32 28 35 26" stroke="#BE123C" strokeWidth="1" fill="none" />
          <path d="M32 22 L31 25 L33 25" stroke="#FCA5A5" strokeWidth="0.6" fill="none" />
          <path d="M20 32 Q32 28 44 32 L48 62 L16 62 Z" fill="#F8FAFC" />
          <path d="M22 34 Q32 30 42 34 L45 60 L19 60 Z" fill="#FEFEFE" />
          <path d="M20 40 L44 40" stroke="#F59E0B" strokeWidth="2" />
          <path d="M18 50 L46 50" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M16 60 L48 60" stroke="#F59E0B" strokeWidth="2" />
          <rect x="30" y="36" width="4" height="14" fill="#F59E0B" />
          <rect x="26" y="40" width="12" height="4" fill="#F59E0B" />
          <rect x="31" y="37" width="2" height="12" fill="#FBBF24" />
          <rect x="27" y="41" width="10" height="2" fill="#FBBF24" />
          <path d="M16 34 L8 52 L16 54 L22 36 Z" fill="#F8FAFC" />
          <path d="M48 34 L56 52 L48 54 L42 36 Z" fill="#F8FAFC" />
          <ellipse cx="32" cy="56" rx="6" ry="3" fill="#FECACA" opacity="0.5" />
          <rect x="28" y="52" width="8" height="10" fill="#7C3AED" />
          <rect x="29" y="53" width="6" height="8" fill="#8B5CF6" />
          <rect x="30" y="54" width="4" height="6" fill="#DDD6FE" />
          <line x1="32" y1="54" x2="32" y2="60" stroke="#7C3AED" strokeWidth="0.5" />
        </svg>
      );
    case 'fairy':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="32" r="20" fill="#F9A8D4" opacity="0.2" className="animate-pulse" />
          <motion.g animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <path d="M32 30 Q10 15 8 35 Q10 50 32 40 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1" />
            <path d="M32 30 Q54 15 56 35 Q54 50 32 40 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1" />
            <path d="M32 32 Q16 20 14 36 Q16 46 32 38 Z" fill="#F9A8D4" opacity="0.6" />
            <path d="M32 32 Q48 20 50 36 Q48 46 32 38 Z" fill="#F9A8D4" opacity="0.6" />
          </motion.g>
          <ellipse cx="32" cy="36" rx="5" ry="8" fill="#FECDD3" />
          <circle cx="32" cy="24" r="7" fill="#FECDD3" />
          <circle cx="32" cy="24" r="6" fill="#FFF1F2" />
          <path d="M26 20 Q28 12 32 14 Q36 12 38 20" fill="#FDE68A" />
          <path d="M25 22 Q24 16 28 14" stroke="#FBBF24" strokeWidth="1" fill="none" />
          <path d="M39 22 Q40 16 36 14" stroke="#FBBF24" strokeWidth="1" fill="none" />
          <ellipse cx="29" cy="23" rx="2" ry="2.5" fill="#1E293B" />
          <ellipse cx="35" cy="23" rx="2" ry="2.5" fill="#1E293B" />
          <circle cx="30" cy="22" r="1" fill="white" />
          <circle cx="36" cy="22" r="1" fill="white" />
          <circle cx="29.5" cy="23.5" r="0.5" fill="#F472B6" />
          <circle cx="35.5" cy="23.5" r="0.5" fill="#F472B6" />
          <ellipse cx="26" cy="26" rx="2" ry="1" fill="#FDA4AF" opacity="0.6" />
          <ellipse cx="38" cy="26" rx="2" ry="1" fill="#FDA4AF" opacity="0.6" />
          <path d="M30 27 Q32 29 34 27" stroke="#BE123C" strokeWidth="0.8" fill="none" />
          <circle cx="32" cy="18" r="2" fill="#FBBF24" />
          <circle cx="29" cy="19" r="1.5" fill="#F472B6" />
          <circle cx="35" cy="19" r="1.5" fill="#A78BFA" />
          <motion.circle cx="20" cy="25" r="1.5" fill="#FDE68A" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="44" cy="30" r="1" fill="#FDE68A" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
          <motion.circle cx="25" cy="45" r="1.2" fill="#FDE68A" animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />
        </svg>
      );
    case 'monster':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <ellipse cx="32" cy="40" rx="18" ry="20" fill="#7F1D1D" />
          <ellipse cx="32" cy="40" rx="16" ry="18" fill="#991B1B" />
          <circle cx="26" cy="35" r="3" fill="#7F1D1D" />
          <circle cx="38" cy="35" r="3" fill="#7F1D1D" />
          <circle cx="32" cy="45" r="3" fill="#7F1D1D" />
          <circle cx="24" cy="45" r="2" fill="#7F1D1D" />
          <circle cx="40" cy="45" r="2" fill="#7F1D1D" />
          <circle cx="32" cy="22" r="14" fill="#991B1B" />
          <circle cx="32" cy="22" r="12" fill="#B91C1C" />
          <path d="M20 14 L16 4 L24 12 Z" fill="#450A0A" />
          <path d="M44 14 L48 4 L40 12 Z" fill="#450A0A" />
          <path d="M21 14 L18 6 L25 12 Z" fill="#7F1D1D" />
          <path d="M43 14 L46 6 L39 12 Z" fill="#7F1D1D" />
          <ellipse cx="26" cy="20" rx="4" ry="5" fill="#FEF3C7" />
          <ellipse cx="38" cy="20" rx="4" ry="5" fill="#FEF3C7" />
          <circle cx="26" cy="21" r="3" fill="#DC2626" />
          <circle cx="38" cy="21" r="3" fill="#DC2626" />
          <circle cx="26" cy="21" r="1.5" fill="#1E293B" />
          <circle cx="38" cy="21" r="1.5" fill="#1E293B" />
          <circle cx="27" cy="20" r="0.8" fill="#7F1D1D" />
          <circle cx="39" cy="20" r="0.8" fill="#7F1D1D" />
          <path d="M22 15 L30 18" stroke="#450A0A" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 15 L34 18" stroke="#450A0A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="32" cy="27" rx="4" ry="3" fill="#7F1D1D" />
          <circle cx="30" cy="27" r="1.5" fill="#450A0A" />
          <circle cx="34" cy="27" r="1.5" fill="#450A0A" />
          <path d="M24 32 Q32 38 40 32" fill="#450A0A" />
          <path d="M26 32 L28 36 L30 32" fill="#FEFEFE" />
          <path d="M34 32 L36 36 L38 32" fill="#FEFEFE" />
          <path d="M30 32 L32 35 L34 32" fill="#FEFEFE" />
          <path d="M14 35 L6 28 L8 26 L16 32 Z" fill="#991B1B" />
          <path d="M50 35 L58 28 L56 26 L48 32 Z" fill="#991B1B" />
          <path d="M6 28 L2 24 M6 28 L4 22 M6 28 L8 23" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 28 L62 24 M58 28 L60 22 M58 28 L56 23" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="24" cy="58" rx="6" ry="4" fill="#7F1D1D" />
          <ellipse cx="40" cy="58" rx="6" ry="4" fill="#7F1D1D" />
        </svg>
      );
    case 'warrior':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M22 12 L42 12 L44 26 L20 26 Z" fill="#92400E" />
          <path d="M24 12 L40 12 L42 24 L22 24 Z" fill="#B45309" />
          <rect x="30" y="14" width="4" height="12" fill="#78350F" />
          <rect x="24" y="18" width="16" height="10" fill="#FDE68A" />
          <ellipse cx="28" cy="22" rx="2" ry="2.5" fill="#1E293B" />
          <ellipse cx="36" cy="22" rx="2" ry="2.5" fill="#1E293B" />
          <circle cx="28.5" cy="21.5" r="0.8" fill="white" />
          <circle cx="36.5" cy="21.5" r="0.8" fill="white" />
          <path d="M26 20 L30 24" stroke="#B45309" strokeWidth="1.5" />
          <path d="M28 26 L36 26" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 28 L46 28 L44 60 L20 60 Z" fill="#92400E" />
          <path d="M20 30 L44 30 L42 58 L22 58 Z" fill="#B45309" />
          <rect x="20" y="32" width="24" height="3" fill="#78350F" />
          <rect x="20" y="40" width="24" height="3" fill="#78350F" />
          <rect x="18" y="48" width="28" height="5" fill="#451A03" />
          <rect x="30" y="47" width="8" height="7" fill="#F59E0B" />
          <ellipse cx="16" cy="32" rx="6" ry="5" fill="#78350F" />
          <ellipse cx="48" cy="32" rx="6" ry="5" fill="#78350F" />
          <ellipse cx="16" cy="32" rx="4" ry="3" fill="#92400E" />
          <ellipse cx="48" cy="32" rx="4" ry="3" fill="#92400E" />
          <path d="M14 32 L8 48 L16 48 L20 34 Z" fill="#92400E" />
          <path d="M50 32 L56 48 L48 48 L44 34 Z" fill="#92400E" />
          <rect x="56" y="20" width="4" height="40" fill="#78350F" />
          <path d="M54 20 L66 16 L66 32 L54 28 Z" fill="#9CA3AF" />
          <path d="M56 21 L64 18 L64 30 L56 27 Z" fill="#D1D5DB" />
          <path d="M54 20 L56 21 L56 27 L54 28 Z" fill="#6B7280" />
        </svg>
      );
    case 'mage':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M22 18 L42 18 L32 2 Z" fill="#1E3A8A" />
          <path d="M24 18 L40 18 L32 6 Z" fill="#1E40AF" />
          <path d="M26 18 L38 18 L32 10 Z" fill="#2563EB" />
          <circle cx="32" cy="12" r="2.5" fill="#60A5FA" />
          <circle cx="32" cy="12" r="1.5" fill="#93C5FD" />
          <circle cx="32.5" cy="11.5" r="0.5" fill="white" />
          <ellipse cx="32" cy="20" rx="12" ry="3" fill="#1E3A8A" />
          <circle cx="32" cy="28" r="9" fill="#DDD6FE" />
          <circle cx="32" cy="28" r="8" fill="#EDE9FE" />
          <ellipse cx="28" cy="26" rx="2.5" ry="3" fill="#1E293B" />
          <ellipse cx="36" cy="26" rx="2.5" ry="3" fill="#1E293B" />
          <circle cx="28" cy="25" r="1.2" fill="#60A5FA" />
          <circle cx="36" cy="25" r="1.2" fill="#60A5FA" />
          <circle cx="28.5" cy="24.5" r="0.4" fill="white" />
          <circle cx="36.5" cy="24.5" r="0.4" fill="white" />
          <path d="M30 34 Q32 38 34 34" stroke="#6B7280" strokeWidth="1.5" fill="none" />
          <path d="M31 35 Q32 38 33 35" fill="#9CA3AF" />
          <path d="M32 28 L30 32 L34 32" stroke="#A78BFA" strokeWidth="0.6" fill="none" />
          <path d="M20 36 Q32 32 44 36 L48 62 L16 62 Z" fill="#312E81" />
          <path d="M22 38 Q32 34 42 38 L45 60 L19 60 Z" fill="#3730A3" />
          <circle cx="26" cy="48" r="1" fill="#FDE68A" />
          <circle cx="38" cy="52" r="1.5" fill="#FBBF24" />
          <circle cx="32" cy="45" r="1" fill="#FDE68A" />
          <circle cx="28" cy="56" r="0.8" fill="#FDE68A" />
          <circle cx="36" cy="42" r="1.2" fill="#FBBF24" />
          <path d="M16 38 L8 54 L16 56 L22 40 Z" fill="#312E81" />
          <path d="M48 38 L56 54 L48 56 L42 40 Z" fill="#312E81" />
          <rect x="54" y="18" width="3" height="44" fill="#5D4037" />
          <circle cx="55.5" cy="14" r="5" fill="#8B5CF6" />
          <circle cx="55.5" cy="14" r="3" fill="#A78BFA" />
          <circle cx="55.5" cy="14" r="1.5" fill="#C4B5FD" className="animate-pulse" />
          <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <circle cx="48" cy="28" r="1" fill="#60A5FA" />
            <circle cx="52" cy="32" r="0.8" fill="#60A5FA" />
            <circle cx="48" cy="36" r="1" fill="#60A5FA" />
          </motion.g>
        </svg>
      );
    case 'rogue':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M18 16 Q32 4 46 16 L48 32 Q32 28 16 32 Z" fill="#111827" />
          <path d="M20 18 Q32 8 44 18 L46 30 Q32 26 18 30 Z" fill="#1F2937" />
          <path d="M22 22 Q32 18 42 22 L40 32 Q32 30 24 32 Z" fill="#0F172A" opacity="0.7" />
          <ellipse cx="28" cy="24" rx="2" ry="1.5" fill="#10B981" />
          <ellipse cx="36" cy="24" rx="2" ry="1.5" fill="#10B981" />
          <circle cx="28" cy="24" r="0.8" fill="#6EE7B7" />
          <circle cx="36" cy="24" r="0.8" fill="#6EE7B7" />
          <path d="M24 26 L40 26 L42 30 L22 30 Z" fill="#374151" />
          <path d="M18 32 L46 32 L44 60 L20 60 Z" fill="#374151" />
          <path d="M20 34 L44 34 L42 58 L22 58 Z" fill="#4B5563" />
          <rect x="20" y="36" width="24" height="2" fill="#78350F" />
          <rect x="22" y="44" width="20" height="2" fill="#78350F" />
          <rect x="18" y="48" width="28" height="4" fill="#451A03" />
          <rect x="30" y="47" width="8" height="6" fill="#6B7280" />
          <rect x="20" y="46" width="2" height="8" fill="#78350F" />
          <rect x="42" y="46" width="2" height="8" fill="#78350F" />
          <path d="M16 34 L10 48 L16 50 L22 36 Z" fill="#374151" />
          <path d="M48 34 L54 48 L48 50 L42 36 Z" fill="#374151" />
          <ellipse cx="10" cy="50" rx="3" ry="4" fill="#1F2937" />
          <ellipse cx="54" cy="50" rx="3" ry="4" fill="#1F2937" />
          <rect x="28" y="38" width="2" height="16" fill="#9CA3AF" transform="rotate(-15 29 46)" />
          <rect x="34" y="38" width="2" height="16" fill="#9CA3AF" transform="rotate(15 35 46)" />
          <path d="M8 36 L4 32 L8 28 Z" fill="#9CA3AF" />
          <path d="M56 36 L60 32 L56 28 Z" fill="#9CA3AF" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="24" r="10" fill="#FDE68A" />
          <circle cx="32" cy="24" r="9" fill="#FEF3C7" />
          <ellipse cx="28" cy="23" rx="2" ry="2" fill="#1E293B" />
          <ellipse cx="36" cy="23" rx="2" ry="2" fill="#1E293B" />
          <circle cx="28.5" cy="22.5" r="0.6" fill="white" />
          <circle cx="36.5" cy="22.5" r="0.6" fill="white" />
          <path d="M29 28 Q32 30 35 28" stroke="#92400E" strokeWidth="1" fill="none" />
          <path d="M22 34 Q32 30 42 34 L44 60 L20 60 Z" fill="#64748B" />
          <path d="M24 36 Q32 32 40 36 L42 58 L22 58 Z" fill="#94A3B8" />
        </svg>
      );
  }
};