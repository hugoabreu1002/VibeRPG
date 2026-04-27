import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass, BattleAnimationType } from '../animations/types';
import type { InventoryItem } from '../../../types/game';
import { EnemySpriteBody } from './EnemySprites';
import { InventorySprite } from '../character/InventorySprite';
import { getMonsterColors } from '../../../lib/utils';

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
  rank?: string;
  battleTheme?: string;
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
  rank = 'F',
  battleTheme,
}: BattleSpriteProps) {
  const [frame, setFrame] = useState(0);
  const colors = getMonsterColors(enemySprite, enemyName);

  const THEME_AURAS: Record<string, string> = {
    grassland: "rgba(34, 197, 94, 0.25)",
    forest: "rgba(22, 101, 52, 0.4)",
    undead: "rgba(168, 85, 247, 0.3)",
    fire: "rgba(239, 68, 68, 0.4)",
    ice: "rgba(14, 165, 233, 0.3)",
    water: "rgba(59, 130, 246, 0.3)",
    cave: "rgba(113, 113, 122, 0.25)",
    mountain: "rgba(148, 163, 184, 0.3)",
    magical: "rgba(129, 140, 248, 0.4)",
    boss: "rgba(245, 158, 11, 0.5)",
  };

  const baseAura = battleTheme ? THEME_AURAS[battleTheme] : colors.primary;
  const hpFactor = hp !== undefined && maxHp !== undefined ? (hp / maxHp) : 1;

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
      className="pixel-sprite relative flex flex-col items-center"
    >
      {/* Name label */}
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black tracking-widest uppercase text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${
        isPlayer ? '' : 'bg-black/20 px-2 py-0.5 rounded-sm border border-amber-500/10'
      }`}>
        {displayName}
      </div>

      {/* Character SVG */}
      <div className="relative pt-8">
        {!isPlayer && (
          <>
            {/* Core Pulse Aura */}
            <motion.div
              animate={{ 
                scale: [1.4, 1.6 * (1.2 - hpFactor * 0.2), 1.4],
                opacity: [0.3, 0.6 * (1.2 - hpFactor * 0.2), 0.3]
              }}
              transition={{ duration: 2 + hpFactor * 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 blur-3xl -z-10"
              style={{ backgroundColor: baseAura, transform: 'scale(1.8) translateY(10px)' }}
            />
            
            {/* Elemental Energy Ripples */}
            <motion.svg
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ duration: 15 + hpFactor * 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-40px] opacity-20 -z-5 pointer-events-none"
            >
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke={colors.secondary}
                strokeWidth="1"
                strokeDasharray="10 5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path
                d="M50 10 L50 20 M10 50 L20 50 M50 90 L50 80 M90 50 L80 50"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.svg>

            {/* Ground Reflection */}
            <div 
              className="absolute -bottom-6 left-1/2 h-6 w-32 -translate-x-1/2 blur-xl -z-20 opacity-30"
              style={{ 
                background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` 
              }}
            />
          </>
        )}
        {isPlayerCharacter ? (
          <InventorySprite
            characterClass={characterClass}
            rank={rank}
            animationType={animationType === 'spell' ? 'spell' : 'idle'}
            equippedWeapon={inventory?.find(i => i.type === 'weapon' && i.equipped)}
            equippedHat={inventory?.find(i => i.type === 'hat' && i.equipped)}
            equippedArmor={inventory?.find(i => i.type === 'armor' && i.equipped)}
          />
        ) : (
          <svg
            width="100"
            height="100"
            viewBox="-50 -50 100 100"
            className="overflow-visible pixel-sprite"
            style={{ transform: `translateY(${bobOffset}px)`, shapeRendering: "crispEdges", marginLeft: "-18px", marginTop: "-18px" }}
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
