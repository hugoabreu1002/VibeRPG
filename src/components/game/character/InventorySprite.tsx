import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass, InventoryItem } from '../../../types/game';
import { getCharacterColors } from '../../../lib/character-utils';

interface InventorySpriteProps {
  characterClass: CharacterClass;
  animationType?: 'idle' | 'spell';
  equippedWeapon?: InventoryItem;
  equippedArmor?: InventoryItem;
  equippedBoot?: InventoryItem;
  equippedHat?: InventoryItem;
}

export function InventorySprite({
  characterClass,
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

  return (
    <motion.div
      variants={getAnimationVariant()}
      initial="initial"
      animate="animate"
      className="relative flex flex-col items-center"
    >
      {/* Character SVG */}
      <svg
        width="64"
        height="64"
        viewBox="-24 -24 48 48"
        className="overflow-visible"
        style={{ transform: `translateY(${bobOffset}px)` }}
      >
        <g>
          {/* Body/Robe */}
          <rect x="-12" y="0" width="24" height="32" fill={colors.primary} />
          {/* Secondary */}
          <rect x="-10" y="2" width="20" height="28" fill={colors.secondary} />
          {/* Accent */}
          <rect x="-8" y="4" width="16" height="2" fill={colors.accent} />
          <rect x="-6" y="20" width="12" height="2" fill={colors.accent} />
          {/* Head */}
          <rect x="-8" y="-16" width="16" height="16" fill={colors.skin} />
          {/* Hair */}
          <rect x="-10" y="-20" width="20" height="6" fill={colors.hair} />
          {/* Hat */}
          {equippedHat && (
            <g>
              {characterClass === 'mage' && (
                <g>
                  <rect x="-12" y="-28" width="24" height="8" fill={colors.secondary} />
                  <rect x="-10" y="-32" width="20" height="4" fill={colors.primary} />
                </g>
              )}
              {characterClass === 'warrior' && (
                <g>
                  {/* Helmet Base */}
                  <path d="M-10 -16 Q0 -30 10 -16 Z" fill="#A9A9A9" />
                  {/* Visor */}
                  <rect x="-8" y="-14" width="16" height="4" fill="#696969" />
                  <rect x="-2" y="-14" width="4" height="6" fill="#D3D3D3" />
                </g>
              )}
              {characterClass === 'priest' && (
                <g>
                  {/* Miter */}
                  <path d="M-8 -16 Q0 -32 8 -16 Z" fill="#FFFFFF" stroke="#FFD700" strokeWidth="1.5" />
                  <rect x="-1" y="-24" width="2" height="8" fill="#FFD700" />
                  <rect x="-4" y="-21" width="8" height="2" fill="#FFD700" />
                  {/* Halo effect */}
                  <circle cx="0" cy="-28" r="4" fill="none" stroke="#FFD700" strokeWidth="1" />
                </g>
              )}
            </g>
          )}
          {/* Eyes */}
          <rect x="-5" y="-12" width="3" height="3" fill="#000" />
          <rect x="2" y="-12" width="3" height="3" fill="#000" />
          {/* Weapon */}
          {equippedWeapon && (
            <g>
              {String(equippedWeapon.id).includes("sword") && (
                <g>
                  <rect x="14" y="8" width="4" height="16" fill="#8B4513" />
                  <rect x="14" y="0" width="4" height="10" fill="#C0C0C0" />
                </g>
              )}
              {String(equippedWeapon.id).includes("staff") && (
                <g>
                  <rect x="14" y="-10" width="3" height="42" fill="#8B4513" />
                  <circle cx="15.5" cy="-14" r="5" fill={colors.accent} />
                </g>
              )}
              {String(equippedWeapon.id).includes("mace") && (
                <g>
                  <rect x="14" y="6" width="4" height="20" fill="#8B4513" />
                  <circle cx="16" cy="4" r="4" fill="#696969" />
                  <circle cx="14" cy="2" r="1" fill="#404040" />
                  <circle cx="18" cy="2" r="1" fill="#404040" />
                  <circle cx="13" cy="4" r="1" fill="#404040" />
                  <circle cx="19" cy="4" r="1" fill="#404040" />
                  <circle cx="16" cy="1" r="1" fill="#404040" />
                </g>
              )}
            </g>
          )}
        </g>
      </svg>
    </motion.div>
  );
}
