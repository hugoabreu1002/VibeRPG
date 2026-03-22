import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterClass, InventoryItem } from '../../../types/game';
import { getCharacterColors, getRankVisuals } from '../../../lib/character-utils';

interface InventorySpriteProps {
  characterClass: CharacterClass;
  rank?: string;
  animationType?: 'idle' | 'spell';
  equippedWeapon?: InventoryItem;
  equippedArmor?: InventoryItem;
  equippedBoot?: InventoryItem;
  equippedHat?: InventoryItem;
}

export function InventorySprite({
  characterClass,
  rank = 'F',
  animationType = 'idle',
  equippedWeapon,
  equippedHat,
}: InventorySpriteProps) {
  const [frame, setFrame] = useState(0);

  // Idle breathing animation
  useEffect(() => {
    if (animationType !== 'idle') return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, [animationType]);

  const colors = getCharacterColors(characterClass);
  const rankVisuals = getRankVisuals(rank);

  if (!colors) return null;

  // Animation variants
  const idleVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -2, 0, -1, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const }
    }
  };

  const spellVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: { 
      scale: [1, 1.2, 1.5, 1],
      opacity: [1, 0.8, 1, 0.5, 1],
      transition: { duration: 0.6 }
    }
  };

  const getAnimationVariant = () => {
    switch (animationType) {
      case 'spell': return spellVariants;
      default: return idleVariants;
    }
  };

  const bobOffset = animationType === 'idle' ? Math.sin(frame * 0.3) * 2 : 0;

  const renderMageCharacter = () => (
    <g>
      <defs>
        <linearGradient id="mage-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="50%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="mage-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <radialGradient id="mage-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Magical aura */}
      <motion.circle 
        cx="0" cy="8" r="20" 
        fill="url(#mage-glow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      
      {/* Robe body */}
      <path d="M-14 4 L-16 32 L16 32 L14 4 Q0 0 -14 4 Z" fill="url(#mage-robe)" stroke="#4C1D95" strokeWidth="0.5" />
      {/* Robe overlay */}
      <path d="M-12 6 L-14 30 L14 30 L12 6 Q0 2 -12 6 Z" fill="#5B21B6" opacity="0.6" />
      
      {/* Belt */}
      <rect x="-14" y="20" width="28" height="3" fill="#78350F" stroke="#451A03" strokeWidth="0.5" />
      <rect x="-2" y="19" width="4" height="5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.3" />
      
      {/* Stars on robe */}
      <circle cx="-6" cy="12" r="1" fill="#FDE68A" opacity="0.8" />
      <circle cx="8" cy="16" r="0.8" fill="#FBBF24" opacity="0.7" />
      <circle cx="-4" cy="26" r="0.6" fill="#FDE68A" opacity="0.6" />
      <circle cx="6" cy="28" r="0.7" fill="#FBBF24" opacity="0.7" />
      
      {/* Neck */}
      <rect x="-4" y="-2" width="8" height="6" fill="url(#mage-skin)" />
      
      {/* Head */}
      <ellipse cx="0" cy="-12" rx="10" ry="11" fill="url(#mage-skin)" />
      <ellipse cx="0" cy="-12" rx="9" ry="10" fill="#FDE68A" />
      
      {/* Hair */}
      <path d="M-10 -16 Q-12 -24 -4 -22 Q0 -28 4 -22 Q12 -24 10 -16 Q8 -18 0 -18 Q-8 -18 -10 -16" fill="#8B5CF6" />
      <path d="M-8 -14 Q-10 -20 -4 -19 Q0 -22 4 -19 Q10 -20 8 -14" fill="#A78BFA" opacity="0.6" />
      
      {/* Eyes */}
      <ellipse cx="-4" cy="-12" rx="2.5" ry="3" fill="#1E293B" />
      <ellipse cx="4" cy="-12" rx="2.5" ry="3" fill="#1E293B" />
      <circle cx="-4" cy="-13" r="1" fill="#A78BFA" />
      <circle cx="4" cy="-13" r="1" fill="#A78BFA" />
      <circle cx="-3.5" cy="-13.5" r="0.4" fill="white" />
      <circle cx="4.5" cy="-13.5" r="0.4" fill="white" />
      
      {/* Eyebrows - serious/concerned */}
      <path d="M-6 -16 L-2 -15" stroke="#6D28D9" strokeWidth="1" fill="none" />
      <path d="M6 -16 L2 -15" stroke="#6D28D9" strokeWidth="1" fill="none" />
      
      {/* Nose */}
      <path d="M0 -10 L-1 -8 L1 -8" stroke="#D97706" strokeWidth="0.5" fill="none" />
      
      {/* Mouth - neutral/serious line */}
      <path d="M-3 -6 L3 -6" stroke="#92400E" strokeWidth="1" fill="none" />
      
      {/* Hat */}
      {equippedHat ? (
        <g>
          <path d="M-12 -18 L0 -36 L12 -18 Z" fill="#4C1D95" stroke="#6D28D9" strokeWidth="0.5" />
          <path d="M-10 -18 L0 -32 L10 -18 Z" fill="#5B21B6" />
          <ellipse cx="0" cy="-18" rx="14" ry="3" fill="#3B0764" />
          <circle cx="0" cy="-28" r="2" fill="#FBBF24" />
          <circle cx="0" cy="-28" r="1" fill="#FDE68A" />
        </g>
      ) : (
        <g>
          {/* Hair without hat */}
          <path d="M-10 -18 Q-12 -26 0 -24 Q12 -26 10 -18" fill="#8B5CF6" />
        </g>
      )}
      
      {/* Sleeves */}
      <path d="M-14 6 L-20 18 L-16 20 L-12 8 Z" fill="url(#mage-robe)" stroke="#4C1D95" strokeWidth="0.3" />
      <path d="M14 6 L20 18 L16 20 L12 8 Z" fill="url(#mage-robe)" stroke="#4C1D95" strokeWidth="0.3" />
      
      {/* Hands */}
      <ellipse cx="-18" cy="19" rx="3" ry="3.5" fill="url(#mage-skin)" />
      <ellipse cx="18" cy="19" rx="3" ry="3.5" fill="url(#mage-skin)" />
      
      {/* Weapon */}
      {equippedWeapon && String(equippedWeapon.id).includes("staff") && (
        <g>
          <rect x="20" y="-16" width="3" height="48" fill="#78350F" stroke="#451A03" strokeWidth="0.3" />
          <circle cx="21.5" cy="-20" r="6" fill="#8B5CF6" stroke="#A78BFA" strokeWidth="0.5" />
          <circle cx="21.5" cy="-20" r="3" fill="#A78BFA" />
          <motion.circle 
            cx="21.5" cy="-20" r="1.5" 
            fill="#C4B5FD"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </g>
      )}
      
      {/* Boots */}
      <rect x="-10" y="30" width="8" height="4" fill="#5D4037" rx="1" />
      <rect x="2" y="30" width="8" height="4" fill="#5D4037" rx="1" />
    </g>
  );

  const renderWarriorCharacter = () => (
    <g>
      <defs>
        <linearGradient id="warrior-armor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="30%" stopColor="#9CA3AF" />
          <stop offset="50%" stopColor="#D1D5DB" />
          <stop offset="70%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
        <linearGradient id="warrior-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      
      {/* Body armor */}
      <path d="M-14 2 L-16 30 L16 30 L14 2 Q0 -2 -14 2 Z" fill="url(#warrior-armor)" stroke="#4B5563" strokeWidth="0.5" />
      {/* Chest plate */}
      <path d="M-12 4 L-14 26 L14 26 L12 4 Q0 0 -12 4 Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.3" />
      
      {/* Shoulder pads */}
      <ellipse cx="-16" cy="6" rx="6" ry="4" fill="#6B7280" stroke="#4B5563" strokeWidth="0.5" />
      <ellipse cx="16" cy="6" rx="6" ry="4" fill="#6B7280" stroke="#4B5563" strokeWidth="0.5" />
      <ellipse cx="-16" cy="6" rx="4" ry="2.5" fill="#9CA3AF" />
      <ellipse cx="16" cy="6" rx="4" ry="2.5" fill="#9CA3AF" />
      
      {/* Chest emblem */}
      <circle cx="0" cy="14" r="4" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
      <path d="M-2 14 L0 10 L2 14 L0 18 Z" fill="#B45309" />
      
      {/* Belt */}
      <rect x="-14" y="22" width="28" height="4" fill="#78350F" stroke="#451A03" strokeWidth="0.5" />
      <rect x="-3" y="21" width="6" height="6" fill="#F59E0B" stroke="#B45309" strokeWidth="0.3" />
      
      {/* Neck */}
      <rect x="-5" y="-2" width="10" height="6" fill="url(#warrior-skin)" />
      
      {/* Head */}
      <ellipse cx="0" cy="-12" rx="10" ry="11" fill="url(#warrior-skin)" />
      <ellipse cx="0" cy="-12" rx="9" ry="10" fill="#FDE68A" />
      
      {/* Hair */}
      <path d="M-8 -18 Q0 -22 8 -18 Q6 -20 0 -20 Q-6 -20 -8 -18" fill="#92400E" />
      
      {/* Eyes */}
      <ellipse cx="-4" cy="-12" rx="2" ry="2.5" fill="#1E293B" />
      <ellipse cx="4" cy="-12" rx="2" ry="2.5" fill="#1E293B" />
      <circle cx="-3.5" cy="-12.5" r="0.6" fill="white" />
      <circle cx="4.5" cy="-12.5" r="0.6" fill="white" />
      
      {/* Angry eyebrows */}
      <path d="M-7 -16 L-2 -15" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 -16 L2 -15" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Nose */}
      <path d="M0 -10 L-1.5 -7 L1.5 -7" stroke="#D97706" strokeWidth="0.6" fill="none" />
      
      {/* Determined mouth */}
      <path d="M-4 -5 L4 -5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Battle scar */}
      <path d="M-8 -10 L-5 -6" stroke="#B45309" strokeWidth="1" />
      
      {/* Helmet */}
      {equippedHat ? (
        <g>
          <path d="M-12 -14 L-14 -8 L14 -8 L12 -14 Q0 -18 -12 -14 Z" fill="#6B7280" stroke="#4B5563" strokeWidth="0.5" />
          <path d="M-10 -14 L0 -20 L10 -14" fill="#9CA3AF" />
          <rect x="-12" y="-10" width="24" height="4" fill="#4B5563" />
          {/* Helmet crest */}
          <path d="M0 -20 L0 -26 L-3 -22 L0 -24 L3 -22 Z" fill="#EF4444" />
        </g>
      ) : (
        <g>
          <path d="M-10 -18 Q0 -24 10 -18" fill="#92400E" />
        </g>
      )}
      
      {/* Arms */}
      <path d="M-14 4 L-22 16 L-18 18 L-12 6 Z" fill="url(#warrior-armor)" stroke="#4B5563" strokeWidth="0.3" />
      <path d="M14 4 L22 16 L18 18 L12 6 Z" fill="url(#warrior-armor)" stroke="#4B5563" strokeWidth="0.3" />
      
      {/* Gauntlets */}
      <ellipse cx="-20" cy="17" rx="4" ry="4" fill="#6B7280" stroke="#4B5563" strokeWidth="0.3" />
      <ellipse cx="20" cy="17" rx="4" ry="4" fill="#6B7280" stroke="#4B5563" strokeWidth="0.3" />
      
      {/* Weapon */}
      {equippedWeapon && String(equippedWeapon.id).includes("sword") && (
        <g>
          <rect x="22" y="4" width="4" height="18" fill="#78350F" stroke="#451A03" strokeWidth="0.3" />
          <path d="M22 -8 L24 -16 L26 -8 L26 4 L22 4 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="0.3" />
          <path d="M23 -6 L24 -12 L25 -6" fill="white" opacity="0.5" />
          <rect x="20" y="2" width="8" height="3" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.3" />
        </g>
      )}
      
      {/* Boots */}
      <rect x="-10" y="28" width="8" height="6" fill="#4B5563" rx="1" />
      <rect x="2" y="28" width="8" height="6" fill="#4B5563" rx="1" />
    </g>
  );

  const renderPriestCharacter = () => (
    <g>
      <defs>
        <linearGradient id="priest-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEFEFE" />
          <stop offset="50%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
        <linearGradient id="priest-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
      </defs>
      
      {/* Holy aura */}
      <motion.circle 
        cx="0" cy="10" r="22" 
        fill="#FDE68A" 
        opacity="0.15"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      
      {/* Robe body */}
      <path d="M-14 2 L-16 32 L16 32 L14 2 Q0 -2 -14 2 Z" fill="url(#priest-robe)" stroke="#D1D5DB" strokeWidth="0.5" />
      {/* Robe overlay */}
      <path d="M-12 4 L-14 30 L14 30 L12 4 Q0 0 -12 4 Z" fill="#FEFEFE" opacity="0.8" />
      
      {/* Golden trim */}
      <path d="M-14 10 L14 10" stroke="#F59E0B" strokeWidth="2" />
      <path d="M-16 20 L16 20" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M-16 28 L16 28" stroke="#F59E0B" strokeWidth="2" />
      
      {/* Holy cross on chest */}
      <rect x="-2" y="8" width="4" height="12" fill="#F59E0B" />
      <rect x="-6" y="12" width="12" height="4" fill="#F59E0B" />
      <rect x="-1.5" y="9" width="3" height="10" fill="#FBBF24" />
      <rect x="-5" y="13" width="10" height="2" fill="#FBBF24" />
      
      {/* Neck */}
      <rect x="-4" y="-2" width="8" height="6" fill="url(#priest-skin)" />
      
      {/* Head */}
      <ellipse cx="0" cy="-12" rx="10" ry="11" fill="url(#priest-skin)" />
      <ellipse cx="0" cy="-12" rx="9" ry="10" fill="#FEE2E2" />
      
      {/* Hair - youthful blonde */}
      <path d="M-9 -16 Q-10 -22 -4 -21 Q0 -24 4 -21 Q10 -22 9 -16 Q6 -19 0 -19 Q-6 -19 -9 -16" fill="#FCD34D" />
      <path d="M-7 -15 Q-8 -20 -3 -19 Q0 -21 3 -19 Q8 -20 7 -15" fill="#FDE68A" opacity="0.7" />
      
      {/* Young serene eyes - larger and brighter */}
      <ellipse cx="-4" cy="-11" rx="2.5" ry="2" fill="#1E293B" />
      <ellipse cx="4" cy="-11" rx="2.5" ry="2" fill="#1E293B" />
      <circle cx="-4" cy="-11.5" r="1" fill="#60A5FA" />
      <circle cx="4" cy="-11.5" r="1" fill="#60A5FA" />
      <circle cx="-3.5" cy="-12" r="0.5" fill="white" />
      <circle cx="4.5" cy="-12" r="0.5" fill="white" />
      
      {/* Serious eyebrows */}
      <path d="M-6 -14 L-2 -13" stroke="#D97706" strokeWidth="0.8" fill="none" />
      <path d="M6 -14 L2 -13" stroke="#D97706" strokeWidth="0.8" fill="none" />
      
      {/* Nose */}
      <path d="M0 -9 L-0.5 -7 L0.5 -7" stroke="#FCA5A5" strokeWidth="0.4" fill="none" />
      
      {/* Neutral mouth - serious line */}
      <path d="M-2 -5 L2 -5" stroke="#BE123C" strokeWidth="0.8" fill="none" />
      
      
      {/* Sleeves */}
      <path d="M-14 4 L-20 16 L-16 18 L-12 6 Z" fill="url(#priest-robe)" stroke="#D1D5DB" strokeWidth="0.3" />
      <path d="M14 4 L20 16 L16 18 L12 6 Z" fill="url(#priest-robe)" stroke="#D1D5DB" strokeWidth="0.3" />
      
      {/* Hands */}
      <ellipse cx="-18" cy="17" rx="3" ry="3.5" fill="url(#priest-skin)" />
      <ellipse cx="18" cy="17" rx="3" ry="3.5" fill="url(#priest-skin)" />
      
      {/* Holy book */}
      <rect x="16" y="12" width="8" height="10" fill="#7C3AED" stroke="#5B21B6" strokeWidth="0.3" />
      <rect x="17" y="13" width="6" height="8" fill="#8B5CF6" />
      <rect x="18" y="14" width="4" height="6" fill="#DDD6FE" />
      <line x1="20" y1="14" x2="20" y2="20" stroke="#7C3AED" strokeWidth="0.3" />
      
      {/* Boots */}
      <rect x="-10" y="30" width="8" height="4" fill="#78350F" rx="1" />
      <rect x="2" y="30" width="8" height="4" fill="#78350F" rx="1" />
    </g>
  );

  const renderRogueCharacter = () => (
    <g>
      <defs>
        <linearGradient id="rogue-outfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2937" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <linearGradient id="rogue-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      
      {/* Body outfit */}
      <path d="M-12 2 L-14 30 L14 30 L12 2 Q0 -2 -12 2 Z" fill="url(#rogue-outfit)" stroke="#111827" strokeWidth="0.5" />
      {/* Leather straps */}
      <rect x="-12" y="8" width="24" height="2" fill="#78350F" />
      <rect x="-10" y="16" width="20" height="2" fill="#78350F" />
      
      {/* Belt with daggers */}
      <rect x="-12" y="22" width="24" height="3" fill="#451A03" stroke="#78350F" strokeWidth="0.3" />
      <rect x="-2" y="21" width="4" height="5" fill="#6B7280" />
      <rect x="-8" y="22" width="2" height="6" fill="#9CA3AF" />
      <rect x="6" y="22" width="2" height="6" fill="#9CA3AF" />
      
      {/* Neck */}
      <rect x="-4" y="-2" width="8" height="6" fill="url(#rogue-skin)" />
      
      {/* Hood */}
      <path d="M-12 -14 Q-14 -24 0 -22 Q14 -24 12 -14 L10 -8 Q0 -12 -10 -8 Z" fill="#111827" stroke="#1F2937" strokeWidth="0.5" />
      <path d="M-10 -12 Q-12 -20 0 -18 Q12 -20 10 -12 L8 -6 Q0 -10 -8 -6 Z" fill="#1F2937" />
      
      {/* Face shadow */}
      <path d="M-8 -8 Q0 -12 8 -8 L6 0 Q0 -4 -6 0 Z" fill="#0F172A" opacity="0.7" />
      
      {/* Glowing eyes */}
      <ellipse cx="-3" cy="-6" rx="2" ry="1.5" fill="#10B981" />
      <ellipse cx="3" cy="-6" rx="2" ry="1.5" fill="#10B981" />
      <circle cx="-3" cy="-6" r="0.8" fill="#6EE7B7" />
      <circle cx="3" cy="-6" r="0.8" fill="#6EE7B7" />
      <circle cx="-2.5" cy="-6.5" r="0.3" fill="#A7F3D0" />
      <circle cx="3.5" cy="-6.5" r="0.3" fill="#A7F3D0" />
      
      {/* Mask/bandana */}
      <path d="M-6 -4 L6 -4 L5 0 L-5 0 Z" fill="#374151" />
      
      {/* Sleeves */}
      <path d="M-12 4 L-18 14 L-14 16 L-10 6 Z" fill="url(#rogue-outfit)" stroke="#111827" strokeWidth="0.3" />
      <path d="M12 4 L18 14 L14 16 L10 6 Z" fill="url(#rogue-outfit)" stroke="#111827" strokeWidth="0.3" />
      
      {/* Gloves */}
      <ellipse cx="-16" cy="15" rx="3" ry="3.5" fill="#1F2937" />
      <ellipse cx="16" cy="15" rx="3" ry="3.5" fill="#1F2937" />
      
      {/* Weapons - dual daggers */}
      {equippedWeapon && (
        <g>
          <rect x="-20" y="10" width="2" height="12" fill="#78350F" />
          <path d="M-20 2 L-19 -4 L-18 2 L-18 10 L-20 10 Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.3" />
          
          <rect x="18" y="10" width="2" height="12" fill="#78350F" />
          <path d="M18 2 L19 -4 L20 2 L20 10 L18 10 Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.3" />
        </g>
      )}
      
      {/* Boots */}
      <rect x="-10" y="28" width="8" height="6" fill="#1F2937" rx="1" />
      <rect x="2" y="28" width="8" height="6" fill="#1F2937" rx="1" />
    </g>
  );

  const renderCharacter = () => {
    switch (characterClass) {
      case 'mage': return renderMageCharacter();
      case 'warrior': return renderWarriorCharacter();
      case 'priest': return renderPriestCharacter();
      case 'rogue': return renderRogueCharacter();
      default: return renderMageCharacter();
    }
  };

  return (
    <motion.div
      variants={getAnimationVariant()}
      initial="initial"
      animate="animate"
      className="relative flex flex-col items-center"
      style={{ scale: rankVisuals.scale }}
    >
      {/* Rank Aura */}
      <AnimatePresence>
        {rank !== 'F' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4], 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-[-12px] rounded-full z-0 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${rankVisuals.aura} 0%, transparent 70%)`,
              border: `1px dashed ${rankVisuals.border}`
            }}
          />
        )}
      </AnimatePresence>

      {/* Rank S Special Glow */}
      {rank === 'S' && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-[-20px] bg-red-500/10 blur-xl rounded-full z-0"
        />
      )}

      {/* Character SVG */}
      <svg
        width="64"
        height="64"
        viewBox="-24 -24 48 48"
        className="overflow-visible"
        style={{ transform: `translateY(${bobOffset}px)` }}
      >
        {renderCharacter()}
      </svg>
    </motion.div>
  );
}