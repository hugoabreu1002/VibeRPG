import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprite } from './Sprite';
import type { CharacterClass, BattleAnimationType } from './animations/types';

interface Character {
  name: string;
  class: CharacterClass;
  hp: number;
  maxHp: number;
  mp?: number;
  maxMp?: number;
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
}

interface BattleSceneProps {
  character: Character;
  enemy: Enemy;
  battleStatus: string;
  onAnimationComplete?: (animation: BattleAnimationType) => void;
  lastAction?: BattleAnimationType;
}

export function BattleScene({
  character,
  enemy,
  battleStatus,
  onAnimationComplete,
  lastAction,
}: BattleSceneProps) {
  const [playerAnimation, setPlayerAnimation] = useState<BattleAnimationType>('idle');
  const [enemyAnimation, setEnemyAnimation] = useState<BattleAnimationType>('idle');
  const [showDamage, setShowDamage] = useState<{ target: 'player' | 'enemy'; value: number } | null>(null);
  const [showSpell, setShowSpell] = useState(false);

  // Handle battle status changes
  useEffect(() => {
    if (battleStatus === 'won') {
      setPlayerAnimation('victory');
      setEnemyAnimation('defeat');
    } else if (battleStatus === 'lost') {
      setPlayerAnimation('defeat');
      setEnemyAnimation('victory');
    }
  }, [battleStatus]);

  // Handle player actions
  useEffect(() => {
    if (!lastAction) return;

    // Player animation sequence
    if (lastAction === 'attack') {
      setPlayerAnimation('attack');
      setTimeout(() => {
        setEnemyAnimation('hit');
        setShowDamage({ target: 'enemy', value: 20 });
        setTimeout(() => setShowDamage(null), 500);
      }, 250);
      setTimeout(() => {
        setPlayerAnimation('idle');
        setEnemyAnimation('idle');
        onAnimationComplete?.('idle');
      }, 500);
    } else if (lastAction === 'spell') {
      setShowSpell(true);
      setPlayerAnimation('spell');
      setTimeout(() => {
        setEnemyAnimation('hit');
        setShowDamage({ target: 'enemy', value: 30 });
        setTimeout(() => setShowDamage(null), 500);
      }, 300);
      setTimeout(() => {
        setPlayerAnimation('idle');
        setEnemyAnimation('idle');
        setShowSpell(false);
        onAnimationComplete?.('idle');
      }, 600);
    } else if (lastAction === 'defend') {
      setPlayerAnimation('defend');
      setTimeout(() => {
        setPlayerAnimation('idle');
        onAnimationComplete?.('idle');
      }, 500);
    }
  }, [lastAction]);

  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        <div className="absolute bottom-20 left-8 w-4 h-20 bg-slate-700 rounded-t" />
        <div className="absolute bottom-20 right-8 w-4 h-16 bg-slate-700 rounded-t" />
      </div>

      {/* Battle arena floor */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-700/30 to-transparent" />

      {/* Player sprite */}
      <motion.div
        className="absolute left-8 bottom-16"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sprite
          characterClass={character.class}
          animationType={playerAnimation}
          isPlayer={true}
          hp={character.hp}
          maxHp={character.maxHp}
        />
      </motion.div>

      {/* Enemy sprite */}
      <motion.div
        className="absolute right-8 bottom-16"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sprite
          enemyName={enemy.name}
          animationType={enemyAnimation}
          isPlayer={false}
          hp={enemy.hp}
          maxHp={enemy.maxHp}
        />
      </motion.div>

      {/* Damage numbers */}
      <AnimatePresence>
        {showDamage && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute text-2xl font-bold ${
              showDamage.target === 'enemy' ? 'right-20' : 'left-20'
            } bottom-32 ${
              showDamage.target === 'enemy' ? 'text-red-400' : 'text-orange-400'
            }`}
          >
            -{showDamage.value}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spell effect */}
      <AnimatePresence>
        {showSpell && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 2, 3],
              x: [0, 100],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute left-20 bottom-24"
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="none" stroke="#00CED1" strokeWidth="2">
                <animate attributeName="r" values="10;18;10" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="20" r="8" fill="#00CED1" opacity="0.5">
                <animate attributeName="r" values="5;12;5" dur="0.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VS indicator */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-white/30"
        >
          VS
        </motion.div>
      </div>
    </div>
  );
}
