import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, Enemy } from "../../types/game";
import type { CharacterClass } from "../animations/types";
import { Sprite } from "./Sprite";

interface QuestBattleProps {
  character: Character;
  enemy: Enemy;
  onVictory: (xp: number, gold: number) => void;
  onDefeat: () => void;
  onFlee: () => void;
  onUpdateCharacter: (updates: Partial<Character>) => void;
}

type BattleAction = "attack" | "spell" | "defend" | "flee";
type BattlePhase = "player-turn" | "enemy-turn" | "victory" | "defeat";

interface BattleLog {
  message: string;
  type: "player" | "enemy" | "system";
}

export function QuestBattle({
  character,
  enemy,
  onVictory,
  onDefeat,
  onFlee,
  onUpdateCharacter,
}: QuestBattleProps) {
  const [playerHp, setPlayerHp] = useState(character.hp);
  const [playerMp, setPlayerMp] = useState(character.mp);
  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [phase, setPhase] = useState<BattlePhase>("player-turn");
  const [logs, setLogs] = useState<BattleLog[]>([
    { message: `⚔️ A wild ${enemy.name} appears!`, type: "system" },
  ]);
  const [isDefending, setIsDefending] = useState(false);
  const [playerAnimation, setPlayerAnimation] = useState<"idle" | "attack" | "spell" | "defend" | "hit">("idle");
  const [enemyAnimation, setEnemyAnimation] = useState<"idle" | "attack" | "hit">("idle");
  const [showDamage, setShowDamage] = useState<{ target: "player" | "enemy"; value: number } | null>(null);

  // Reset when enemy changes
  useEffect(() => {
    setEnemyHp(enemy.maxHp);
    setPlayerHp(character.hp);
    setPlayerMp(character.mp);
    setPhase("player-turn");
    setIsDefending(false);
    setLogs([{ message: `⚔️ A wild ${enemy.name} appears!`, type: "system" }]);
  }, [enemy.id]);

  // Check for victory/defeat
  useEffect(() => {
    if (enemyHp <= 0 && phase !== "victory") {
      setPhase("victory");
      setLogs((prev) => [...prev, { message: `🎉 You defeated the ${enemy.name}!`, type: "system" }]);
      onVictory(enemy.xpReward, enemy.goldReward);
    } else if (playerHp <= 0 && phase !== "defeat") {
      setPhase("defeat");
      setLogs((prev) => [...prev, { message: `💀 You were defeated by the ${enemy.name}...`, type: "system" }]);
      onDefeat();
    }
  }, [enemyHp, playerHp, phase]);

  // Enemy turn
  useEffect(() => {
    if (phase === "enemy-turn") {
      const timer = setTimeout(() => {
        enemyTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const addLog = (message: string, type: "player" | "enemy" | "system") => {
    setLogs((prev) => [...prev.slice(-4), { message, type }]);
  };

  const playerAttack = () => {
    if (phase !== "player-turn") return;
    
    // Calculate damage with some randomness
    const baseDamage = character.attack;
    const variance = Math.floor(Math.random() * 6) - 3; // -3 to +3
    const damage = Math.max(1, baseDamage + variance - Math.floor(enemy.defense / 3));
    
    // Animation
    setPlayerAnimation("attack");
    setTimeout(() => setEnemyAnimation("hit"), 200);
    setTimeout(() => setShowDamage({ target: "enemy", value: damage }), 250);
    setTimeout(() => setShowDamage(null), 800);
    setTimeout(() => setPlayerAnimation("idle"), 400);
    setTimeout(() => setEnemyAnimation("idle"), 500);

    // Apply damage
    setEnemyHp((prev) => Math.max(0, prev - damage));
    addLog(`⚔️ You attack for ${damage} damage!`, "player");
    
    setPhase("enemy-turn");
  };

  const playerSpell = () => {
    if (phase !== "player-turn") return;
    
    const spellCost = 10;
    if (playerMp < spellCost) {
      addLog("❌ Not enough MP to cast spell!", "system");
      return;
    }

    setPlayerMp((prev) => prev - spellCost);
    
    // Calculate magic damage
    const baseDamage = character.magicPower;
    const variance = Math.floor(Math.random() * 8) - 4;
    const damage = Math.max(1, baseDamage + variance - Math.floor(enemy.defense / 5));
    
    // Animation
    setPlayerAnimation("spell");
    setTimeout(() => setEnemyAnimation("hit"), 300);
    setTimeout(() => setShowDamage({ target: "enemy", value: damage }), 350);
    setTimeout(() => setShowDamage(null), 900);
    setTimeout(() => setPlayerAnimation("idle"), 600);
    setTimeout(() => setEnemyAnimation("idle"), 700);

    // Apply damage
    setEnemyHp((prev) => Math.max(0, prev - damage));
    addLog(`✨ You cast a spell for ${damage} magic damage!`, "player");
    
    setPhase("enemy-turn");
  };

  const playerDefend = () => {
    if (phase !== "player-turn") return;
    
    setPlayerAnimation("defend");
    setIsDefending(true);
    setTimeout(() => setPlayerAnimation("idle"), 500);
    
    addLog("🛡️ You take a defensive stance!", "player");
    setPhase("enemy-turn");
  };

  const playerFlee = () => {
    if (phase !== "player-turn") return;
    
    // 50% chance to flee
    if (Math.random() > 0.5) {
      addLog("🏃 You successfully fled from battle!", "player");
      setTimeout(() => onFlee(), 500);
    } else {
      addLog("❌ Failed to flee! The enemy catches you!", "enemy");
      setPhase("enemy-turn");
    }
  };

  const enemyTurn = () => {
    // Enemy chooses action
    const actions: Array<"attack" | "spell"> = enemy.magicPower > 10 ? ["attack", "attack", "spell"] : ["attack", "attack", "attack"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    let damage: number;
    
    if (action === "spell") {
      const baseDamage = enemy.magicPower;
      const variance = Math.floor(Math.random() * 4) - 2;
      damage = Math.max(1, baseDamage + variance);
      addLog(`✨ The ${enemy.name} casts a spell!`, "enemy");
    } else {
      const baseDamage = enemy.attack;
      const variance = Math.floor(Math.random() * 4) - 2;
      damage = Math.max(1, baseDamage + variance);
      addLog(`⚔️ The ${enemy.name} attacks!`, "enemy");
    }

    // Apply defense reduction
    if (isDefending) {
      damage = Math.max(1, Math.floor(damage / 2));
      addLog(`🛡️ Your defense reduces damage to ${damage}!`, "player");
    } else {
      addLog(`💥 You take ${damage} damage!`, "enemy");
    }

    // Animation
    setEnemyAnimation("attack");
    setTimeout(() => setPlayerAnimation("hit"), 200);
    setTimeout(() => setShowDamage({ target: "player", value: damage }), 250);
    setTimeout(() => setShowDamage(null), 800);
    setTimeout(() => setEnemyAnimation("idle"), 400);
    setTimeout(() => setPlayerAnimation("idle"), 500);

    // Apply damage
    setPlayerHp((prev) => Math.max(0, prev - damage));
    
    // Reset defense
    setIsDefending(false);
    
    // Check if player died before returning to player turn
    if (playerHp - damage > 0) {
      setPhase("player-turn");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl bg-slate-900 p-4 shadow-lg"
    >
      {/* Battle Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">⚔️ Battle!</h2>
        <span className="text-sm text-slate-400">Turn-based Combat</span>
      </div>

      {/* Battle Arena */}
      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 mb-4 min-h-[250px] overflow-hidden">
        {/* Player */}
        <div className="absolute left-8 bottom-8 flex flex-col items-center">
          <div className="transform scale-150 mb-6 mt-4">
            <Sprite 
              characterClass={character.class} 
              playerName={character.name}
              isPlayer={true} 
              animationType={playerAnimation}
            />
          </div>
          
          {/* Player HP Bar */}
          <div className="w-24 mt-4">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>HP</span>
              <span>{playerHp}/{character.maxHp}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: `${(playerHp / character.maxHp) * 100}%` }}
                animate={{ width: `${(playerHp / character.maxHp) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Player MP Bar */}
          <div className="w-24 mt-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>MP</span>
              <span>{playerMp}/{character.maxMp}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: `${(playerMp / character.maxMp) * 100}%` }}
                animate={{ width: `${(playerMp / character.maxMp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl font-bold text-white/30">VS</div>
        </div>

        {/* Enemy */}
        <div className="absolute right-8 bottom-8 flex flex-col items-center">
          <div className="transform scale-150 mb-6 mt-4">
            <Sprite 
              enemyName={enemy.name} 
              isPlayer={false} 
              animationType={enemyAnimation}
            />
          </div>
          
          {/* Enemy HP Bar */}
          <div className="w-24 mt-4">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>HP</span>
              <span>{enemyHp}/{enemy.maxHp}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: "100%" }}
                animate={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Damage Numbers */}
        <AnimatePresence>
          {showDamage && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -50, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute text-3xl font-bold z-10 ${
                showDamage.target === "enemy" ? "right-32" : "left-32"
              } bottom-32 ${
                showDamage.target === "enemy" ? "text-red-400" : "text-orange-400"
              }`}
            >
              -{showDamage.value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Battle Log */}
      <div className="bg-slate-800 rounded-lg p-3 mb-4 h-24 overflow-y-auto">
        <div className="space-y-1">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`text-sm ${
                log.type === "player"
                  ? "text-green-400"
                  : log.type === "enemy"
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {phase === "player-turn" && (
        <div className="grid grid-cols-4 gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerAttack}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold flex flex-col items-center"
          >
            <span className="text-xl mb-1">⚔️</span>
            <span className="text-sm">Attack</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerSpell}
            disabled={playerMp < 10}
            className={`py-3 px-4 rounded-lg font-semibold flex flex-col items-center ${
              playerMp >= 10
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-600 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span className="text-xl mb-1">✨</span>
            <span className="text-sm">Spell</span>
            <span className="text-xs opacity-75">10 MP</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerDefend}
            className="bg-blue-400 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex flex-col items-center"
          >
            <span className="text-xl mb-1">🛡️</span>
            <span className="text-sm">Defend</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerFlee}
            className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg font-semibold flex flex-col items-center"
          >
            <span className="text-xl mb-1">🏃</span>
            <span className="text-sm">Flee</span>
          </motion.button>
        </div>
      )}

      {/* Victory/Defeat overlay */}
      {(phase === "victory" || phase === "defeat") && (
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-4xl mb-2 ${phase === "victory" ? "text-green-400" : "text-red-400"}`}
          >
            {phase === "victory" ? "🏆" : "💀"}
          </motion.div>
          <p className={`text-lg font-bold mb-2 ${phase === "victory" ? "text-green-400" : "text-red-400"}`}>
            {phase === "victory" ? "Victory!" : "Defeat!"}
          </p>
          {phase === "victory" && (
            <p className="text-amber-400 text-sm">
              +{enemy.xpReward} XP • +{enemy.goldReward} Gold
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
