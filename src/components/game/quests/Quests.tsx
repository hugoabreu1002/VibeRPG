import { motion } from "framer-motion";
import type { Character, Quest, QuestChoice, QuestState, QuestResult, InventoryItem } from "../../../types/game";
import { WeaponIcon } from "../items/WeaponIcon";
import { ArmorIcon } from "../items/ArmorIcon";
import { HatIcon } from "../items/HatIcon";
import { BootIcon } from "../items/BootIcon";
import { SkillIcon } from "../battle/SkillIcons";

interface QuestsProps {
  character: Character;
  quests: Quest[];
  questState: QuestState;
  activeQuest: Quest | null;
  questResult: QuestResult | null;
  completedQuests: string[];
  onStartQuest: (quest: Quest) => void;
  onAttemptChoice: (choice: QuestChoice) => void;
  onResetQuest: () => void;
}

const CLASS_ICONS: Record<string, string> = {
  mage: "🔮",
  warrior: "⚔️",
  priest: "✝️",
};

export function Quests({
  character,
  quests,
  questState,
  activeQuest,
  questResult,
  completedQuests,
  onStartQuest,
  onAttemptChoice,
  onResetQuest
}: QuestsProps) {
  const availableQuests = quests.filter(
    q => q.class === character.class && q.minLevel <= character.level && !completedQuests.includes(q.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fantasy-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gold" style={{ fontFamily: "'Cinzel', serif" }}>🗺️ Quests</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-950/50 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-700/30 font-medium">
            {CLASS_ICONS[character.class] || "⚔️"}
            {' '}{character.class.toUpperCase()} Quests
          </span>
        </div>
      </div>

      {questState === "list" && (
        <div className="space-y-4">
          {availableQuests.length === 0 ? (
            <div className="text-center py-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🏆
              </motion.div>
              <p className="text-xl font-bold text-gold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Legendary Progress!</p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">You've conquered all challenges in this region. Return later for more epic quests.</p>
            </div>
          ) : (
            availableQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "rgba(245, 158, 11, 0.4)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)"
                }}
                className="border border-slate-700/40 rounded-xl p-5 bg-slate-800/20 backdrop-blur-sm transition-all group relative overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all"></div>
                
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div>
                    <h3 className="font-bold text-lg text-amber-100 group-hover:text-amber-200 transition-colors">{quest.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        📍 {quest.region}
                      </span>
                      <span className="text-[10px] text-amber-500/70 font-bold border border-amber-900/30 px-1.5 py-0.5 rounded bg-amber-950/20">
                        LV. {quest.minLevel}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStartQuest(quest)}
                    className="btn-fantasy px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Embark
                  </motion.button>
                </div>
                
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{quest.description}</p>
                
                <div className="flex gap-2 flex-wrap relative z-10">
                  {quest.choices.map((choice, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-slate-900/40 border border-slate-700/30 px-2 py-1 rounded-md text-slate-400 flex items-center gap-1.5">
                      {choice.requiredStat === 'attack' && <span className="text-red-400">⚔️ ATK</span>}
                      {choice.requiredStat === 'magicPower' && <span className="text-blue-400">🔮 MAG</span>}
                      {choice.requiredStat === 'defense' && <span className="text-cyan-400">🛡️ DEF</span>}
                      <span className="text-slate-500 opacity-50">|</span>
                      <span>{choice.difficulty}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {questState === "active" && activeQuest && (
        <div className="space-y-5">
          <motion.button
            whileHover={{ x: -2 }}
            onClick={onResetQuest}
            className="text-xs font-bold text-slate-500 hover:text-amber-300 transition-colors flex items-center gap-1 uppercase tracking-widest bg-slate-900/30 px-3 py-1.5 rounded-full border border-slate-800"
          >
            ← Retreat
          </motion.button>

          <div className="relative border border-amber-900/20 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 overflow-hidden">
            {/* Contextual Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800/50">
               <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center text-3xl shadow-lg shadow-amber-900/20">
                 📜
               </div>
               <div>
                  <h3 className="font-bold text-xl text-amber-50 text-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>{activeQuest.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">任务地区：{activeQuest.region}</p>
               </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-8 italic opacity-90 border-l-2 border-amber-700/30 pl-4">{activeQuest.description}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
                <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">Select Your Path</p>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
              </div>

              <div className="grid gap-3">
                {activeQuest.choices.map((choice, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ 
                      scale: 1.01,
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      backgroundColor: "rgba(15, 23, 42, 0.6)"
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onAttemptChoice(choice)}
                    className="w-full text-left p-4 rounded-xl border border-slate-800/80 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-800/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-amber-100 transition-colors leading-snug block">{choice.text}</span>
                    </div>
                    <div className="ml-4 shrink-0">
                      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/30 px-3 py-1.5 rounded-lg text-slate-300 shadow-inner">
                        {choice.requiredStat === 'attack' && <span className="text-lg">⚔️</span>}
                        {choice.requiredStat === 'magicPower' && <span className="text-lg">🔮</span>}
                        {choice.requiredStat === 'defense' && <span className="text-lg">🛡️</span>}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold text-slate-500 leading-none mb-0.5">REQ</span>
                          <span className="text-xs font-bold leading-none">{choice.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/10 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/10 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/10 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/10 rounded-br-xl"></div>
          </div>
        </div>
      )}

      {questState === "result" && questResult && (
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-lg p-6 text-center ${questResult.success
                ? "bg-emerald-950/30 border border-emerald-700/30"
                : "bg-red-950/30 border border-red-700/30"
              }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-4xl mb-4"
            >
              {questResult.success ? '🎉' : '😔'}
            </motion.div>

            <h3 className={`text-lg font-bold mb-2 ${questResult.success ? "text-emerald-400" : "text-red-400"
              }`} style={{ fontFamily: "'Cinzel', serif" }}>
              {questResult.success ? "Quest Complete!" : "Quest Failed"}
            </h3>

            <p className="text-sm text-slate-400 mb-4">{questResult.message}</p>

            {questResult.success && (
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-950/50 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-700/30"
                  >
                    +{questResult.xp} XP
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-amber-950/40 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-700/30"
                  >
                    +{questResult.gold} Gold
                  </motion.span>
                </div>

                {/* Reward Item */}
                {questResult.rewardItem && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 max-w-xs mx-auto text-center"
                  >
                    <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mb-3 leading-none">New Equipment Acquired!</p>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                        {questResult.rewardItem.type === "weapon" && <WeaponIcon weaponId={questResult.rewardItem.id} size="w-8 h-8" />}
                        {questResult.rewardItem.type === "armor" && <ArmorIcon armorId={questResult.rewardItem.id} size="w-8 h-8" />}
                        {questResult.rewardItem.type === "hat" && <HatIcon hatId={questResult.rewardItem.id} size="w-8 h-8" />}
                        {questResult.rewardItem.type === "boot" && <BootIcon bootId={questResult.rewardItem.id} size="w-8 h-8" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-amber-100 leading-tight">{questResult.rewardItem.name}</p>
                        <p className="text-[10px] text-amber-500/80 capitalize">{questResult.rewardItem.rarity} {questResult.rewardItem.type}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reward Skill */}
                {questResult.rewardSkill && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-blue-500/30 max-w-xs mx-auto text-center"
                  >
                    <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mb-3 leading-none">New Skill Learned!</p>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                        <SkillIcon skill={questResult.rewardSkill as any} className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-blue-100 leading-tight capitalize">{questResult.rewardSkill}</p>
                        <p className="text-[10px] text-blue-400/80">Skill Unlocked</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResetQuest}
            className="btn-fantasy w-full py-3 rounded-lg font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Continue
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
