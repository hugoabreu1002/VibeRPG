import { motion } from "framer-motion";
import { Character } from "../../../types/game";
import { RANKS, canEvolve, getNextRank, getRankSkills } from "../../../lib/rank-utils";
import { GoldIcon, XPIcon } from "./GameIcons";
import { audioManager } from "../../../lib/audio";

interface GuildEvolutionProps {
  character: Character;
  onEvolve: (updatedCharacter: Character) => void;
  onClose: () => void;
}

export function GuildEvolution({ character, onEvolve, onClose }: GuildEvolutionProps) {
  const nextRank = getNextRank(character.rank);
  const evolutionCheck = canEvolve(character);

  const handleEvolve = () => {
    if (!nextRank || !evolutionCheck.can) return;

    audioManager.playSfx("victory");
    
    const newSkills = getRankSkills(character.class, nextRank.rank);
    
    const updatedCharacter: Character = {
      ...character,
      rank: nextRank.rank,
      gold: character.gold - nextRank.cost,
      skills: newSkills,
      // Boost stats on rank up? 
      maxHp: character.maxHp + 20,
      hp: character.maxHp + 20,
      maxMp: character.maxMp + 20,
      mp: character.maxMp + 20,
      attack: character.attack + 5,
      defense: character.defense + 5,
      magicPower: character.magicPower + 5,
    };

    onEvolve(updatedCharacter);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>Adventurer's Guild</h2>
          <p className="text-sm text-slate-400">Evolve your rank and unlock legendary potential</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
        {/* Current Status */}
        <div className="fantasy-card p-6 bg-slate-900/40 border-slate-700/30">
          <h3 className="text-xs font-bold text-amber-500/60 uppercase tracking-widest mb-4">Current Status</h3>
          <div className="flex flex-col items-center py-4">
             <div 
               className="text-6xl font-black mb-2 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
               style={{ color: RANKS.find(r => r.rank === character.rank)?.color }}
             >
               {character.rank}
             </div>
             <span className="text-lg font-bold text-amber-100">{RANKS.find(r => r.rank === character.rank)?.label}</span>
          </div>
          
          <div className="space-y-3 mt-4">
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Current Gold</span>
               <span className="text-amber-300 font-bold flex items-center gap-1">
                 <GoldIcon size={14} /> {character.gold.toLocaleString()}
               </span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Current Level</span>
               <span className="text-emerald-400 font-bold flex items-center gap-1">
                 <XPIcon size={14} /> {character.level}
               </span>
             </div>
          </div>
        </div>

        {/* Evolution Path */}
        <div className="fantasy-card p-6 bg-slate-900/60 border-amber-500/20 shadow-lg shadow-black/50 overflow-hidden relative">
          {nextRank ? (
            <>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
              >
                <h3 className="text-xs font-bold text-amber-500/60 uppercase tracking-widest mb-4">Next Evolution</h3>
                <div className="flex flex-col items-center py-4">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.1, 1],
                       filter: [`drop-shadow(0 0 10px ${nextRank.color}44)`, `drop-shadow(0 0 25px ${nextRank.color}88)`, `drop-shadow(0 0 10px ${nextRank.color}44)`]
                     }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="text-7xl font-black mb-2"
                     style={{ color: nextRank.color }}
                   >
                     {nextRank.rank}
                   </motion.div>
                   <span className="text-xl font-bold text-white">{nextRank.label}</span>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Evolution Cost</span>
                      <span className={`text-base font-bold flex items-center gap-1.5 ${character.gold >= nextRank.cost ? 'text-amber-400' : 'text-red-400'}`}>
                        <GoldIcon size={18} /> {nextRank.cost.toLocaleString()}
                      </span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Min. Level Required</span>
                      <span className={`text-base font-bold flex items-center gap-1.5 ${character.level >= nextRank.minLevel ? 'text-emerald-400' : 'text-red-400'}`}>
                         Level {nextRank.minLevel}
                      </span>
                   </div>
                </div>

                <div className="mt-6">
                   <h4 className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mb-2">Unlocked Potential</h4>
                   <div className="flex flex-wrap gap-2">
                      <span className="text-xs py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200">New Class Skills</span>
                      <span className="text-xs py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">Permanent Stat Boost</span>
                      <span className="text-xs py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200">Elite Character Sprite</span>
                   </div>
                </div>

                <motion.button
                  whileHover={evolutionCheck.can ? { scale: 1.02, y: -2 } : {}}
                  whileTap={evolutionCheck.can ? { scale: 0.98 } : {}}
                  disabled={!evolutionCheck.can}
                  onClick={handleEvolve}
                  className={`w-full mt-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl ${
                    evolutionCheck.can 
                      ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-900 shadow-amber-500/30 cursor-pointer" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700/50"
                  }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {evolutionCheck.can ? "Begin Evolution" : "Requirements Not Met"}
                </motion.button>
                
                {!evolutionCheck.can && (
                  <p className="text-center text-xs text-red-400/80 mt-3 font-medium italic">
                    {evolutionCheck.reason}
                  </p>
                )}
              </motion.div>
              
              {/* Background Glow */}
              <div 
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${nextRank.color} 0%, transparent 70%)` }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
               <div className="text-5xl mb-4">👑</div>
               <h3 className="text-xl font-bold text-amber-200 mb-2">Maximum Rank Reached!</h3>
               <p className="text-sm text-slate-400">You have attained the pinnacle of power. You are a true Legend of VibeRPG.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
