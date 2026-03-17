import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass, BattleAnimationType } from '../animations/types';

// Generate pixel art colors based on class
const getCharacterColors = (characterClass: CharacterClass) => {
  switch (characterClass) {
    case 'mage':
      return {
        primary: '#4B0082',
        secondary: '#9370DB',
        accent: '#00CED1',
        skin: '#FFDDC1',
        hair: '#2F1B0C',
      };
    case 'warrior':
      return {
        primary: '#8B0000',
        secondary: '#CD5C5C',
        accent: '#FFD700',
        skin: '#DEB887',
        hair: '#8B4513',
      };
    case 'priest':
      return {
        primary: '#FFFFFF',
        secondary: '#F5F5F5',
        accent: '#FFD700',
        skin: '#FFE4C4',
        hair: '#F5DEB3',
      };
  }
};

const getEnemyColors = (enemyName: string) => {
  if (enemyName.includes('Construct')) {
    return { primary: '#708090', secondary: '#B0C4DE', accent: '#00FFFF' };
  } else if (enemyName.includes('Undead')) {
    return { primary: '#2F4F4F', secondary: '#556B2F', accent: '#00FF00' };
  } else if (enemyName.includes('Mirror')) {
    return { primary: '#E6E6FA', secondary: '#D8BFD8', accent: '#FF69B4' };
  } else if (enemyName.includes('Pupil')) {
    return { primary: '#4B0082', secondary: '#8A2BE2', accent: '#FF4500' };
  } else if (enemyName.includes('Guardian')) {
    return { primary: '#8B4513', secondary: '#A0522D', accent: '#FFA500' };
  } else if (enemyName.includes('Shade')) {
    return { primary: '#191970', secondary: '#4169E1', accent: '#00BFFF' };
  } else if (enemyName.includes('Demon')) {
    return { primary: '#8B0000', secondary: '#FF4500', accent: '#FFD700' };
  } else if (enemyName.includes('Elemental')) {
    return { primary: '#4B0082', secondary: '#9400D3', accent: '#00FF7F' };
  }
  return { primary: '#333333', secondary: '#666666', accent: '#FFFFFF' };
};

interface BattleSpriteProps {
  characterClass?: CharacterClass;
  enemyName?: string;
  playerName?: string;
  animationType?: BattleAnimationType;
  isPlayer?: boolean;
  hp?: number;
  maxHp?: number;
}

export function BattleSprite({
  characterClass,
  enemyName,
  playerName,
  animationType = 'idle',
  isPlayer = true,
  hp,
  maxHp,
}: BattleSpriteProps) {
  const [frame, setFrame] = useState(0);

  // Idle breathing animation
  useEffect(() => {
    if (animationType !== 'idle') return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, [animationType]);

  const playerColors = characterClass ? getCharacterColors(characterClass) : null;
  const enemyColors = enemyName ? getEnemyColors(enemyName) : null;
  const colors = playerColors || enemyColors;

  if (!colors) return null;
  
  const isPlayerCharacter = isPlayer && characterClass;
  const hasSkinHair = isPlayerCharacter && playerColors;

  // Animation variants
  const idleVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -2, 0, -1, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const }
    }
  };

  const attackVariants = {
    initial: { x: 0 },
    animate: { 
      x: isPlayer ? [0, 40, 0, -20, 0] : [0, -40, 0, 20, 0],
      transition: { duration: 0.5 }
    }
  };

  const hitVariants = {
    initial: { x: 0 },
    animate: { 
      x: isPlayer ? [0, -10, 10, -10, 5, 0] : [0, 10, -10, 10, -5, 0],
      transition: { duration: 0.3 }
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

  const victoryVariants = {
    initial: { y: 0, rotate: 0 },
    animate: { 
      y: [0, -20, 0, -10, 0],
      rotate: [0, 5, -5, 3, 0],
      transition: { repeat: Infinity, duration: 1 }
    }
  };

  const defeatVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 90, 90],
      y: [0, 20, 20],
      transition: { duration: 0.8 }
    }
  };

  const getAnimationVariant = () => {
    switch (animationType) {
      case 'attack': return attackVariants;
      case 'hit': return hitVariants;
      case 'spell': return spellVariants;
      case 'victory': return victoryVariants;
      case 'defeat': return defeatVariants;
      default: return idleVariants;
    }
  };

  const bobOffset = animationType === 'idle' ? Math.sin(frame * 0.3) * 2 : 0;
  const displayName = isPlayer 
    ? (playerName || (characterClass ? characterClass.charAt(0).toUpperCase() + characterClass.slice(1) : 'Hero'))
    : enemyName || 'Enemy';

  return (
    <motion.div
      variants={getAnimationVariant()}
      initial="initial"
      animate="animate"
      className="relative flex flex-col items-center"
    >
      {/* Name label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono font-bold text-white drop-shadow-md">
        {displayName}
      </div>

      {/* Character SVG */}
      <svg
        width="64"
        height="64"
        viewBox="-24 -24 48 48"
        className="overflow-visible"
        style={{ transform: `translateY(${bobOffset}px)` }}
      >
        {hasSkinHair && playerColors ? (
          <g>
            {/* Body/Robe */}
            <rect x="-12" y="0" width="24" height="32" fill={playerColors.primary} />
            {/* Secondary */}
            <rect x="-10" y="2" width="20" height="28" fill={playerColors.secondary} />
            {/* Accent */}
            <rect x="-8" y="4" width="16" height="2" fill={playerColors.accent} />
            <rect x="-6" y="20" width="12" height="2" fill={playerColors.accent} />
            {/* Head */}
            <rect x="-8" y="-16" width="16" height="16" fill={playerColors.skin} />
            {/* Hair */}
            <rect x="-10" y="-20" width="20" height="6" fill={playerColors.hair} />
            {/* Eyes */}
            <rect x="-5" y="-12" width="3" height="3" fill="#000" />
            <rect x="2" y="-12" width="3" height="3" fill="#000" />
          </g>
        ) : (
          <g>
            {/* Enemy body */}
            <rect x="-16" y="-8" width="32" height="32" fill={colors.primary} stroke={colors.secondary} strokeWidth="2" />
            {/* Eyes */}
            <circle cx="-6" cy="0" r="4" fill={colors.accent} />
            <circle cx="6" cy="0" r="4" fill={colors.accent} />
            <circle cx="-6" cy="0" r="2" fill="#000" />
            <circle cx="6" cy="0" r="2" fill="#000" />
          </g>
        )}
      </svg>

      {/* Health bar */}
      {hp !== undefined && maxHp !== undefined && (
        <div className="mt-2 w-16">
          <div className="h-1.5 w-full rounded-sm bg-gray-700">
            <motion.div
              className="h-full rounded-sm"
              initial={{ width: '100%' }}
              animate={{ 
                width: `${Math.max(0, (hp / maxHp) * 100)}%`,
                backgroundColor: hp / maxHp > 0.5 ? '#22C55E' : hp / maxHp > 0.25 ? '#EAB308' : '#EF4444'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
