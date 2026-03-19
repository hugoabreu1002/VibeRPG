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
          <circle cx="32" cy="24" r="10" fill="#FDE68A" />
          <path d="M22 24 Q32 18 42 24" stroke="#D1D5DB" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M20 34 C20 45 44 45 44 34 L32 60 Z" fill="#4B5563" />
          <path d="M25 24 Q32 30 39 24" stroke="#92400E" strokeWidth="1" fill="none" />
          <rect x="30" y="40" width="4" height="20" fill="#78350F" />
        </svg>
      );
    case 'guard':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <rect x="24" y="16" width="16" height="16" rx="2" fill="#94A3B8" />
          <rect x="28" y="20" width="8" height="4" fill="#334155" />
          <path d="M20 32 L44 32 L40 60 L24 60 Z" fill="#1E293B" />
          <rect x="42" y="32" width="4" height="24" fill="#64748B" />
          <rect x="40" y="30" width="8" height="4" fill="#F59E0B" />
        </svg>
      );
    case 'merchant':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="24" r="10" fill="#FDBA74" />
          <path d="M20 20 L44 20 L32 10 Z" fill="#92400E" />
          <path d="M20 34 C20 45 44 45 44 34 L32 60 Z" fill="#065F46" />
          <rect x="15" y="40" width="10" height="10" fill="#B45309" />
          <rect x="39" y="40" width="10" height="10" fill="#B45309" />
        </svg>
      );
    case 'wizard':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="28" r="8" fill="#DDD6FE" />
          <path d="M15 28 L49 28 L32 5 Z" fill="#4C1D95" />
          <path d="M20 34 C20 50 44 50 44 34 L32 60 Z" fill="#5B21B6" />
          <circle cx="45" cy="40" r="4" fill="#A78BFA" className="animate-pulse" />
        </svg>
      );
    case 'knight':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M24 10 L40 10 L44 30 L20 30 Z" fill="#CBD5E1" />
          <path d="M30 10 L34 10 L32 5 Z" fill="#EF4444" />
          <path d="M20 32 L44 32 L42 60 L22 60 Z" fill="#475569" />
          <path d="M44 32 L52 32 L52 50 L44 45 Z" fill="#EF4444" />
        </svg>
      );
    case 'priest':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="24" r="9" fill="#FEE2E2" />
          <path d="M20 34 C20 55 44 55 44 34 L32 60 Z" fill="#F8FAFC" />
          <rect x="30" y="38" width="4" height="12" fill="#F59E0B" />
          <rect x="26" y="42" width="12" height="4" fill="#F59E0B" />
        </svg>
      );
    case 'fairy':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M32 32 L10 15 L10 49 Z" fill="#F472B6" opacity="0.6" />
          <path d="M32 32 L54 15 L54 49 Z" fill="#F472B6" opacity="0.6" />
          <circle cx="32" cy="32" r="6" fill="#FBCFE8" />
          <circle cx="32" cy="28" r="4" fill="#F9A8D4" />
        </svg>
      );
    case 'monster':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="32" r="12" fill="#DC2626" />
          <path d="M24 24 L20 15" stroke="#DC2626" strokeWidth="4" />
          <path d="M40 24 L44 15" stroke="#DC2626" strokeWidth="4" />
          <rect x="26" y="28" width="4" height="4" fill="white" />
          <rect x="34" y="28" width="4" height="4" fill="white" />
        </svg>
      );
    case 'warrior':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M20 15 L44 15 L32 5 Z" fill="#B45309" />
          <circle cx="32" cy="24" r="10" fill="#FDE68A" />
          <path d="M20 34 C20 50 44 50 44 34 L32 60 Z" fill="#92400E" />
          <rect x="42" y="30" width="4" height="24" fill="#94A3B8" />
          <rect x="40" y="28" width="8" height="4" fill="#B45309" />
        </svg>
      );
    case 'mage':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M15 25 L49 25 L32 2 Z" fill="#1E3A8A" />
          <circle cx="32" cy="28" r="9" fill="#DDD6FE" />
          <path d="M20 36 C20 52 44 52 44 36 L32 60 Z" fill="#312E81" />
          <circle cx="45" cy="40" r="5" fill="#60A5FA" className="animate-pulse" />
        </svg>
      );
    case 'rogue':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M20 15 L44 15 L44 30 L20 30 Z" fill="#111827" />
          <rect x="28" y="20" width="8" height="4" fill="#EF4444" />
          <path d="M20 34 C20 50 44 50 44 34 L32 60 Z" fill="#374151" />
          <path d="M45 40 L55 50" stroke="#94A3B8" strokeWidth="3" />
        </svg>
      );
    default:

      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="24" r="10" fill="#E2E8F0" />
          <path d="M20 34 C20 50 44 50 44 34 L32 60 Z" fill="#64748B" />
        </svg>
      );
  }
};
