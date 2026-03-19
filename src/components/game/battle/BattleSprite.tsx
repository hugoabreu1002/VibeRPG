import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass, BattleAnimationType } from '../animations/types';
import type { InventoryItem } from '../../../types/game';
import { EnemySpriteBody } from './EnemySprites';
import { InventorySprite } from '../character/InventorySprite';

interface BattleSpriteProps {
  characterClass?: CharacterClass;
  enemyName?: string;
  enemySprite?: string;
  playerName?: string;
  animationType?: BattleAnimationType;
  isPlayer?: boolean;
  hp?: number;
  maxHp?: number;
  inventory?: InventoryItem[];
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
  inventory,
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

  const isPlayerCharacter = isPlayer && !!characterClass;

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
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black tracking-widest uppercase text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/20 px-2 py-0.5 rounded-full border border-amber-500/10">
        {displayName}
      </div>

      {/* Character SVG */}
      <div className="relative pt-8">
        {isPlayerCharacter ? (
          <InventorySprite
            characterClass={characterClass}
            animationType={animationType === 'spell' ? 'spell' : 'idle'}
            equippedWeapon={inventory?.find(i => i.type === 'weapon' && i.equipped)}
            equippedHat={inventory?.find(i => i.type === 'hat' && i.equipped)}
            equippedArmor={inventory?.find(i => i.type === 'armor' && i.equipped)}
          />
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="-24 -24 48 48"
            className="overflow-visible"
            style={{ transform: `translateY(${bobOffset}px)` }}
          >
            <EnemySpriteBody sprite={enemySprite || 'default'} />
          </svg>
        )}
      </div>

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
