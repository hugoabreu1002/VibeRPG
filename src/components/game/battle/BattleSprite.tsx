import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass, BattleAnimationType } from '../animations/types';
import { EnemySpriteBody } from './EnemySprites';

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

interface BattleSpriteProps {
  characterClass?: CharacterClass;
  enemyName?: string;
  enemySprite?: string;
  playerName?: string;
  animationType?: BattleAnimationType;
  isPlayer?: boolean;
  hp?: number;
  maxHp?: number;
}

export function BattleSprite({
  characterClass,
  enemyName,
  enemySprite,
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
  const isPlayerCharacter = isPlayer && characterClass;

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
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono font-bold text-amber-200 drop-shadow-md">
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
        {isPlayerCharacter && playerColors ? (
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
          <EnemySpriteBody sprite={enemySprite || 'default'} />
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
