import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, Enemy } from "../../../types/game";
import type { CharacterClass } from "../animations/types";
import { BattleSprite } from "../battle/BattleSprite";
import { SkillIcon } from "../battle/SkillIcons";
import { audioManager } from "../../../lib/audio";
import { 
  SwordIcon, SparkleIcon, ShieldIcon, VictoryIcon, DefeatIcon, 
  HealthIcon, ManaIcon, GoldIcon, XPIcon 
} from "../ui/GameIcons";

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
  icon?: "attack" | "spell" | "defend" | "victory" | "defeat";
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
    { message: `A wild ${enemy.name} appears!`, type: "system", icon: "attack" },
  ]);
  const [isDefending, setIsDefending] = useState(false);
  const [playerAnimation, setPlayerAnimation] = useState<"idle" | "attack" | "spell" | "defend" | "hit">("idle");
  const [enemyAnimation, setEnemyAnimation] = useState<"idle" | "attack" | "hit">("idle");
  const [showDamage, setShowDamage] = useState<{ target: "player" | "enemy"; value: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Reset when enemy changes
  useEffect(() => {
    setEnemyHp(enemy.maxHp);
    setPlayerHp(character.hp);
    setPlayerMp(character.mp);
    setPhase("player-turn");
    setIsDefending(false);
    setLogs([{ message: `A wild ${enemy.name} appears!`, type: "system", icon: "attack" }]);
    
    // Switch to battle music
    audioManager.playBgm("battle");
  }, [enemy.id]);
  
  // Sync health/mana to sidebar character state
  useEffect(() => {
    onUpdateCharacter({
      hp: playerHp,
      mp: playerMp,
    });
  }, [playerHp, playerMp, onUpdateCharacter]);


  // Check for victory/defeat
  useEffect(() => {
    if (enemyHp <= 0 && phase !== "victory") {
      setPhase("victory");
      setLogs((prev) => [...prev, { message: `You defeated the ${enemy.name}!`, type: "system", icon: "victory" }]);
      audioManager.playSfx("victory");
      onVictory(enemy.xpReward, enemy.goldReward);
    } else if (playerHp <= 0 && phase !== "defeat") {
      setPhase("defeat");
      setLogs((prev) => [...prev, { message: `You were defeated by the ${enemy.name}...`, type: "system", icon: "defeat" }]);
      audioManager.playSfx("defeat");
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

  const addLog = (message: string, type: "player" | "enemy" | "system", icon?: BattleLog["icon"]) => {
    setLogs((prev) => [...prev.slice(-4), { message, type, icon }]);
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
    addLog(`You attack for ${damage} damage!`, "player", "attack");
    audioManager.playSfx("attack");

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
    addLog(`You cast a spell for ${damage} magic damage!`, "player", "spell");
    audioManager.playSfx("spell");

    setPhase("enemy-turn");
  };

  const playerDefend = () => {
    if (phase !== "player-turn") return;

    setPlayerAnimation("defend");
    setIsDefending(true);
    setTimeout(() => setPlayerAnimation("idle"), 500);

    addLog("You take a defensive stance!", "player", "defend");
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
      addLog(`The ${enemy.name} casts a spell!`, "enemy", "spell");
    } else {
      const baseDamage = enemy.attack;
      const variance = Math.floor(Math.random() * 4) - 2;
      damage = Math.max(1, baseDamage + variance);
      addLog(`The ${enemy.name} attacks!`, "enemy", "attack");
    }

    // Apply defense reduction
    if (isDefending) {
      damage = Math.max(1, Math.floor(damage / 2));
      addLog(`Your defense reduces damage to ${damage}!`, "player", "defend");
    } else {
      addLog(`You take ${damage} damage!`, "enemy", "defeat");
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
    audioManager.playSfx("hit");
    
    // Trigger screen shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

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


      {/* Battle Arena */}
      <motion.div 
        animate={isShaking ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-b from-slate-800/80 to-slate-900/90 rounded-2xl p-8 mb-6 min-h-[400px] overflow-hidden border border-slate-700/30 shadow-2xl shadow-black/50"
      >
        {/* Player */}
        <div className="absolute left-[28%] bottom-16 flex flex-col items-center">
          <div className="transform scale-150 mb-4">
            <BattleSprite
              characterClass={character.class}
              playerName={character.name}
              isPlayer={true}
              animationType={playerAnimation}
              inventory={character.inventory}
            />
          </div>
        </div>



        {/* Enemy */}
        <div className="absolute right-[28%] bottom-16 flex flex-col items-center">
          <div className="transform scale-150 mb-6 mt-4">
            <BattleSprite
              enemyName={enemy.name}
              enemySprite={enemy.sprite}
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
            <div className="h-6 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/30">
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
              className={`absolute text-3xl font-bold z-10 ${showDamage.target === "enemy" ? "right-32" : "left-32"
                } bottom-32 ${showDamage.target === "enemy" ? "text-red-400" : "text-orange-400"
                }`}
            >
              -{showDamage.value}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Battle Log */}
      <div className="bg-slate-800 rounded-lg p-3 mb-4 h-24 overflow-y-auto">
        <div className="space-y-1">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`text-sm flex items-center gap-2 ${log.type === "player"
                  ? "text-green-400"
                  : log.type === "enemy"
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
            >
              <div className="shrink-0 w-4 h-4 opacity-70">
                {log.icon === "attack" && <SwordIcon size={14} />}
                {log.icon === "spell" && <SparkleIcon size={14} />}
                {log.icon === "defend" && <ShieldIcon size={14} />}
                {log.icon === "victory" && <VictoryIcon size={14} />}
                {log.icon === "defeat" && <DefeatIcon size={14} />}
              </div>
              <span>{log.message}</span>
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
            className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-3 px-2 rounded-lg font-semibold flex flex-col items-center border border-red-500/30 shadow-lg shadow-red-900/30"
          >
            <div className="w-6 h-6 mb-1">
              <SkillIcon skill={character.class === 'mage' ? 'bolt' : character.class === 'warrior' ? 'slash' : 'smite'} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">{character.class === 'mage' ? 'Arcane Bolt' : character.class === 'warrior' ? 'Slash' : 'Smite'}</span>
          </motion.button>

          {character.skills.some(s => ['fireball', 'strike', 'holy'].includes(s)) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playerSpell}
              disabled={playerMp < 10}
              className={`py-3 px-2 rounded-lg font-semibold flex flex-col items-center border shadow-lg ${playerMp >= 10
                  ? "bg-gradient-to-b from-blue-600 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white border-blue-500/30 shadow-blue-900/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700/30"
                }`}
            >
              <div className="w-6 h-6 mb-1">
                <SkillIcon skill={character.class === 'mage' ? 'fireball' : character.class === 'warrior' ? 'strike' : 'holy'} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{character.class === 'mage' ? 'Fireball' : character.class === 'warrior' ? 'Power Strike' : 'Holy Light'}</span>
              <span className="text-[10px] opacity-75">10 MP</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerDefend}
            className="bg-gradient-to-b from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-white py-3 px-2 rounded-lg font-semibold flex flex-col items-center border border-cyan-500/30 shadow-lg shadow-cyan-900/30"
          >
            <div className="w-6 h-6 mb-1">
              <SkillIcon skill={character.class === 'priest' ? 'barrier' : 'defend'} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">{character.class === 'priest' ? 'Barrier' : 'Defend'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playerFlee}
            className="bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white py-3 px-2 rounded-lg font-semibold flex flex-col items-center border border-slate-500/30 shadow-lg shadow-slate-900/30"
          >
            <div className="w-6 h-6 mb-1">
              <SkillIcon skill="flee" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">Flee</span>
          </motion.button>
        </div>
      )}

      {/* Victory/Defeat overlay */}
      {(phase === "victory" || phase === "defeat") && (
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex justify-center mb-2 ${phase === "victory" ? "text-green-400" : "text-red-400"}`}
          >
            {phase === "victory" ? <VictoryIcon size={64} /> : <DefeatIcon size={64} />}
          </motion.div>
          <p className={`text-xl font-bold mb-3 uppercase tracking-widest ${phase === "victory" ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "'Cinzel', serif" }}>
            {phase === "victory" ? "Quest Victory" : "Quest Failed"}
          </p>
          {phase === "victory" && (
            <div className="flex justify-center gap-4">
               <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-800/20">
                 <XPIcon size={14} /> +{enemy.xpReward}
               </span>
               <span className="flex items-center gap-1.5 text-amber-400 text-sm font-bold bg-amber-950/30 px-3 py-1 rounded-full border border-amber-800/20">
                 <GoldIcon size={14} /> +{enemy.goldReward}
               </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
