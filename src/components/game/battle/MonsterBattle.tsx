import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, Enemy } from "../../../types/game";
import { BattleSprite } from "./BattleSprite";
import { SkillIcon } from "./SkillIcons";
import { audioManager } from "../../../lib/audio";
import { 
  SwordIcon, SparkleIcon, ShieldIcon, VictoryIcon, DefeatIcon, 
  HealthIcon, ManaIcon, GoldIcon, XPIcon,
  TileTreeIcon, TileWaterIcon, TileMountainIcon, TileCaveIcon, TileLavaIcon
} from "../ui/GameIcons";
import { ThemeProp } from "./ThemeProps";
import type { MusicTrack } from "../../../lib/audio";
import { getMonsterColors } from "../../../lib/utils";

interface MonsterBattleProps {
  character: Character;
  enemy: Enemy;
  onVictory: (xp: number, gold: number) => void;
  onDefeat: () => void;
  onFlee: () => void;
  onUpdateCharacter: (updates: Partial<Character>) => void;
}

type BattlePhase = "player-turn" | "enemy-turn" | "victory" | "defeat";

interface BattleLog {
  message: string;
  type: "player" | "enemy" | "system";
  icon?: "attack" | "spell" | "defend" | "victory" | "defeat";
}

const BATTLE_THEMES: Record<string, { gradient: string, music: MusicTrack, icons: any[] }> = {
  grassland: {
    gradient: "from-emerald-900/40 to-slate-900/90",
    music: "battle",
    icons: [TileTreeIcon]
  },
  forest: {
    gradient: "from-green-950/60 to-slate-950/95",
    music: "battle_forest",
    icons: [TileTreeIcon, TileTreeIcon]
  },
  undead: {
    gradient: "from-purple-950/50 to-slate-950/95",
    music: "battle_undead",
    icons: [TileCaveIcon]
  },
  fire: {
    gradient: "from-orange-950/60 to-red-950/90",
    music: "battle_fire",
    icons: [TileLavaIcon]
  },
  ice: {
    gradient: "from-cyan-900/40 to-slate-900/90",
    music: "battle_magical",
    icons: [TileMountainIcon]
  },
  water: {
    gradient: "from-blue-900/40 to-slate-900/90",
    music: "battle_magical",
    icons: [TileWaterIcon]
  },
  cave: {
    gradient: "from-zinc-900/80 to-black",
    music: "battle_undead",
    icons: [TileCaveIcon]
  },
  mountain: {
    gradient: "from-slate-800/50 to-slate-950/95",
    music: "battle_forest",
    icons: [TileMountainIcon]
  },
  magical: {
    gradient: "from-indigo-900/50 to-slate-950/95",
    music: "battle_magical",
    icons: [TileCaveIcon]
  },
  boss: {
    gradient: "from-amber-950/40 via-red-950/60 to-black",
    music: "battle_boss",
    icons: [TileLavaIcon, TileLavaIcon]
  }
};

export function MonsterBattle({
  character,
  enemy,
  onVictory,
  onDefeat,
  onFlee,
  onUpdateCharacter,
}: MonsterBattleProps) {
  const theme = BATTLE_THEMES[enemy.battleTheme || "grassland"] || BATTLE_THEMES.grassland;

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
  const monsterColors = getMonsterColors(enemy.sprite, enemy.name);
  
  const customGradient = `linear-gradient(to bottom, 
    hsla(${monsterColors.hue}, 40%, 10%, 0.8), 
    hsla(${(monsterColors.hue + 180) % 360}, 20%, 5%, 0.95)
  )`;

  useEffect(() => {
    setEnemyHp(enemy.maxHp);
    setPlayerHp(character.hp);
    setPlayerMp(character.mp);
    setPhase("player-turn");
    setIsDefending(false);
    setLogs([{ message: `A wild ${enemy.name} appears!`, type: "system", icon: "attack" }]);
    audioManager.playBgm(theme.music);
  }, [enemy.id, theme.music]);
  
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
      setLogs((prev) => [...prev, { message: `${enemy.name} defeated!`, type: "system", icon: "victory" }]);
      audioManager.playSfx("victory");
      
      // Delay to show the victory screen
      setTimeout(() => {
        onVictory(enemy.xpReward, enemy.goldReward);
      }, 2000);
    } else if (playerHp <= 0 && phase !== "defeat") {
      setPhase("defeat");
      setLogs((prev) => [...prev, { message: `${enemy.name} defeated you!`, type: "system", icon: "defeat" }]);
      audioManager.playSfx("defeat");
      
      setTimeout(() => {
        onDefeat();
      }, 2000);
    }
  }, [enemyHp, playerHp, phase, enemy.xpReward, enemy.goldReward, onVictory, onDefeat, enemy.name]);

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
    const baseDamage = character.attack;
    const variance = Math.floor(Math.random() * 6) - 3;
    const damage = Math.max(1, baseDamage + variance - Math.floor(enemy.defense / 3));

    setPlayerAnimation("attack");
    setTimeout(() => setEnemyAnimation("hit"), 200);
    setTimeout(() => setShowDamage({ target: "enemy", value: damage }), 250);
    setTimeout(() => setShowDamage(null), 800);
    setTimeout(() => setPlayerAnimation("idle"), 400);
    setTimeout(() => setEnemyAnimation("idle"), 500);

    setEnemyHp((prev) => Math.max(0, prev - damage));
    addLog(`You deal ${damage} damage!`, "player", "attack");
    audioManager.playSfx("attack");
    setPhase("enemy-turn");
  };

  const playerSpell = () => {
    if (phase !== "player-turn") return;
    const spellCost = 10;
    if (playerMp < spellCost) {
      addLog("Not enough MP!", "system");
      return;
    }
    setPlayerMp((prev) => prev - spellCost);
    const baseDamage = character.magicPower;
    const variance = Math.floor(Math.random() * 8) - 4;
    const damage = Math.max(1, baseDamage + variance - Math.floor(enemy.defense / 5));

    setPlayerAnimation("spell");
    setTimeout(() => setEnemyAnimation("hit"), 300);
    setTimeout(() => setShowDamage({ target: "enemy", value: damage }), 350);
    setTimeout(() => setShowDamage(null), 900);
    setTimeout(() => setPlayerAnimation("idle"), 600);
    setTimeout(() => setEnemyAnimation("idle"), 700);

    setEnemyHp((prev) => Math.max(0, prev - damage));
    addLog(`You cast a spell for ${damage} damage!`, "player", "spell");
    audioManager.playSfx("spell");
    setPhase("enemy-turn");
  };

  const playerDefend = () => {
    if (phase !== "player-turn") return;
    setPlayerAnimation("defend");
    setIsDefending(true);
    setTimeout(() => setPlayerAnimation("idle"), 500);
    addLog("You raise your guard!", "player", "defend");
    setPhase("enemy-turn");
  };

  const playerFlee = () => {
    if (phase !== "player-turn") return;
    if (Math.random() > 0.5) {
      addLog("You escaped successfully!", "player");
      setTimeout(() => onFlee(), 1000);
    } else {
      addLog("You couldn't escape!", "enemy");
      setPhase("enemy-turn");
    }
  };

  const enemyTurn = () => {
    const actions: Array<"attack" | "spell"> = enemy.magicPower > 10 ? ["attack", "attack", "spell"] : ["attack", "attack", "attack"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    let damage: number;

    if (action === "spell") {
      const baseDamage = enemy.magicPower;
      const variance = Math.floor(Math.random() * 4) - 2;
      damage = Math.max(1, baseDamage + variance);
      addLog(`${enemy.name} casts a spell!`, "enemy", "spell");
    } else {
      const baseDamage = enemy.attack;
      const variance = Math.floor(Math.random() * 4) - 2;
      damage = Math.max(1, baseDamage + variance);
      addLog(`${enemy.name} attacks!`, "enemy", "attack");
    }

    if (isDefending) {
      damage = Math.max(1, Math.floor(damage / 2));
      addLog(`Defense reduces damage to ${damage}!`, "player", "defend");
    } else {
      addLog(`You take ${damage} damage!`, "enemy", "defeat");
    }

    setEnemyAnimation("attack");
    setTimeout(() => setPlayerAnimation("hit"), 200);
    setTimeout(() => setShowDamage({ target: "player", value: damage }), 250);
    setTimeout(() => setShowDamage(null), 800);
    setTimeout(() => setEnemyAnimation("idle"), 400);
    setTimeout(() => setPlayerAnimation("idle"), 500);

    setPlayerHp((prev) => Math.max(0, prev - damage));
    audioManager.playSfx("hit");
    
    const shakeDuration = enemy.battleTheme === 'boss' ? 800 : 400;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), shakeDuration);
    setIsDefending(false);

    if (playerHp - damage > 0) {
      setPhase("player-turn");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl bg-slate-900 p-4 shadow-lg h-full border border-amber-500/10"
    >
      <motion.div 
        animate={isShaking ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl p-8 mb-6 min-h-[400px] overflow-hidden border border-slate-700/30 shadow-2xl shadow-black/50"
      >
        <div className="absolute inset-0 z-0 transition-colors duration-1000" style={{ background: customGradient }} />
        <div className={`absolute inset-0 z-0 opacity-20 bg-gradient-to-b ${theme.gradient}`} />
        
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
           {theme.icons.map((Icon, i) => (
             <div key={i} className="absolute" style={{ 
                 left: `${15 + (i * 40) + (Math.random() * 20)}%`, 
                 bottom: `${10 + (Math.random() * 20)}%`,
                 transform: `scale(${1.5 + Math.random()}) rotate(${Math.random() * 20 - 10}deg)`
               }}>
               <Icon size={120} />
             </div>
           ))}
        </div>

        <div className="absolute top-0 right-0 bottom-0 w-[60%] z-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <ThemeProp key={`theme-prop-${i}`} theme={enemy.battleTheme || 'grassland'} color={monsterColors.secondary} index={i} />
          ))}
        </div>

        <div className="absolute left-[28%] bottom-16 flex flex-col items-center">
          <div className="transform scale-150 mb-4">
            <BattleSprite characterClass={character.class} playerName={character.name} isPlayer={true} animationType={playerAnimation} inventory={character.inventory} />
          </div>
        </div>

        <div className="absolute right-[28%] bottom-16 flex flex-col items-center">
          <div className="transform scale-150 mb-6 mt-4">
            <BattleSprite enemyName={enemy.name} enemySprite={enemy.sprite} isPlayer={false} animationType={enemyAnimation} battleTheme={enemy.battleTheme} />
          </div>
          <div className="w-32 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 opacity-60">
                {enemy.name}
              </span>
              <span className="text-[10px] font-mono text-slate-300">{Math.ceil(enemyHp)}/{enemy.maxHp}</span>
            </div>
            <div className="h-6 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/30">
              <motion.div className="h-full bg-red-500" initial={{ width: "100%" }} animate={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showDamage && (
            <motion.div initial={{ opacity: 1, y: 0, scale: 0.5 }} animate={{ opacity: 0, y: -50, scale: 1.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className={`absolute text-3xl font-bold z-10 ${showDamage.target === "enemy" ? "right-32" : "left-32"} bottom-32 ${showDamage.target === "enemy" ? "text-red-400" : "text-orange-400"}`}>
              -{showDamage.value}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-4 h-28 overflow-y-auto border border-white/5 scrollbar-thin">
        <div className="space-y-1.5">
          {logs.map((log, idx) => (
            <div key={idx} className={`text-sm flex items-center gap-2 font-medium ${log.type === "player" ? "text-green-400" : log.type === "enemy" ? "text-red-400" : "text-slate-400"}`}>
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

      {phase === "player-turn" && (
        <div className="grid grid-cols-4 gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={playerAttack} className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-4 rounded-xl font-bold flex flex-col items-center border border-red-500/30 shadow-lg shadow-red-900/40">
            <SkillIcon skill={character.class === 'mage' ? 'bolt' : character.class === 'warrior' ? 'slash' : 'smite'} className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{character.class === 'mage' ? 'Arcane Bolt' : character.class === 'warrior' ? 'Slash' : 'Smite'}</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={playerSpell} disabled={playerMp < 10} className={`py-4 rounded-xl font-bold flex flex-col items-center border shadow-lg ${playerMp >= 10 ? "bg-gradient-to-b from-blue-600 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white border-blue-500/30 shadow-blue-900/40" : "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700/30"}`}>
            <SkillIcon skill={character.class === 'mage' ? 'fireball' : character.class === 'warrior' ? 'strike' : 'holy'} className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{character.class === 'mage' ? 'Fireball' : character.class === 'warrior' ? 'Power Strike' : 'Holy Light'}</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={playerDefend} className="bg-gradient-to-b from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-white py-4 rounded-xl font-bold flex flex-col items-center border border-cyan-500/30 shadow-lg shadow-cyan-900/40">
            <SkillIcon skill={character.class === 'priest' ? 'barrier' : 'defend'} className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{character.class === 'priest' ? 'Barrier' : 'Defend'}</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={playerFlee} className="bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white py-4 rounded-xl font-bold flex flex-col items-center border border-slate-500/30 shadow-lg shadow-slate-900/40">
            <SkillIcon skill="flee" className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">Flee</span>
          </motion.button>
        </div>
      )}

      {(phase === "victory" || phase === "defeat") && (
        <div className="text-center py-6 bg-slate-800/30 rounded-2xl border border-white/5 backdrop-blur-sm">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className={`flex justify-center mb-2 ${phase === "victory" ? "text-amber-400" : "text-red-500"}`}>
            {phase === "victory" ? <VictoryIcon size={80} /> : <DefeatIcon size={80} />}
          </motion.div>
          <h2 className={`text-4xl font-black mb-4 ${phase === "victory" ? "text-amber-400" : "text-red-500"}`} style={{ fontFamily: "'Cinzel', serif" }}>
            {phase === "victory" ? "BATTLE WON!" : "BATTLE LOST"}
          </h2>
          {phase === "victory" && (
            <div className="flex justify-center gap-6">
               <div className="flex flex-col items-center">
                 <span className="text-xs text-slate-400 uppercase font-bold mb-1">Experience</span>
                 <div className="flex items-center gap-2 text-2xl font-black text-emerald-400 bg-emerald-950/40 px-6 py-2 rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20">
                   <XPIcon size={24} /> +{enemy.xpReward}
                 </div>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-xs text-slate-400 uppercase font-bold mb-1">Gold Scavenged</span>
                 <div className="flex items-center gap-2 text-2xl font-black text-amber-400 bg-amber-950/40 px-6 py-2 rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-900/20">
                   <GoldIcon size={24} /> +{enemy.goldReward}
                 </div>
               </div>
            </div>
          )}
          {phase === "defeat" && (
            <p className="text-slate-400 font-medium">You were overpowered by the wild monster...</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
