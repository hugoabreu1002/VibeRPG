import { motion } from "framer-motion";
import { Character, Quest } from "../../../types/game";
import { QUESTS } from "../../../lib/game-data";
import { REGIONS } from "../../../lib/region-utils";
import { GoldIcon, XPIcon, SwordIcon } from "./GameIcons";

interface QuestBoardProps {
  character: Character;
  completedQuests: string[];
  onAcceptQuest: (quest: Quest) => void;
  onCompleteQuest: (quest: Quest) => void;
  activeQuestId?: string | null;
  acceptedQuests?: string[];
}

export function QuestBoard({ character, completedQuests, onAcceptQuest, onCompleteQuest, activeQuestId }: QuestBoardProps) {
  const currentRegion = REGIONS[character.currentRegion] || REGIONS["Hub Town"];

  // Available quests for the player in the current region (max 3 per map)
  const availableQuests = currentRegion.availableQuests.filter(questId => {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return false;

    // Class match
    // Unified quest system: remove class restriction
    return true;

    // Not completed
    if (completedQuests.includes(questId)) return false;

    // Level match
    if (character.level < quest.minLevel) return false;

    return true;
  }).slice(0, 3).map(id => QUESTS.find(q => q.id === id)!);

  const activeQuest = activeQuestId ? QUESTS.find(q => q.id === activeQuestId) : null;

  // Show all available quests (up to 3 per map), but not if there's an active quest
  const displayQuests = activeQuest ? [] : availableQuests;
  const progress = activeQuestId && character.questProgress ? (character.questProgress[activeQuestId] ?? 0) : 0;
  const isBountyComplete = activeQuest?.bounty && progress >= activeQuest.bounty.targetCount;

  // Check if active quest is from an NPC (not in region's availableQuests)
  const isNpcQuest = activeQuest && !currentRegion.availableQuests.includes(activeQuest.id);

  return (
    <div className="flex flex-col h-full">
      {/* Active Quest Banner */}
      {activeQuest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg border ${isBountyComplete
            ? 'bg-emerald-950/30 border-emerald-500/50'
            : 'bg-amber-950/30 border-amber-500/50'
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-lg ${isBountyComplete ? '✅' : '⚔️'}`}></span>
            <div className="flex-1">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isBountyComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isBountyComplete ? 'Ready!' : 'Active'}
              </span>
              <h3 className="font-bold text-sm text-white truncate">{activeQuest.title}</h3>
            </div>
          </div>

          {activeQuest.bounty && !isBountyComplete && (
            <div className="bg-slate-950/60 p-2 rounded border border-slate-700/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <SwordIcon size={12} className="text-amber-500" />
                  Hunt {activeQuest.bounty.targetMonsterId.replace(/-/g, ' ')}s
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {progress}/{activeQuest.bounty.targetCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (progress / activeQuest.bounty.targetCount) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {isBountyComplete && (
            <button
              onClick={() => onCompleteQuest(activeQuest)}
              className="mt-2 w-full py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition-all"
            >
              <SwordIcon size={14} />
              Complete Contract
            </button>
          )}
        </motion.div>
      )}

      {/* Active Quest from NPC */}
      {activeQuest && isNpcQuest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 fantasy-card p-5 bg-gradient-to-r from-amber-950/40 to-amber-900/20 border-amber-500/40 shadow-lg shadow-amber-900/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 text-lg">📋</span>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Active Contract from World</span>
          </div>
          <h3 className="font-bold text-lg text-amber-100 mb-1">{activeQuest.title}</h3>
          <p className="text-sm text-slate-400 italic mb-3">"{activeQuest.description}"</p>

          {/* Bounty Progress for NPC Quest */}
          {activeQuest.bounty && (
            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between items-center mb-1.5 text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400 flex items-center gap-1.5 capitalize">
                  <SwordIcon size={12} className="text-amber-500" />
                  Kill {activeQuest.bounty.targetCount} {activeQuest.bounty.targetMonsterId.replace(/-/g, " ")}s
                </span>
                <span className={isBountyComplete ? "text-emerald-400" : "text-amber-400"}>
                  {progress} / {activeQuest.bounty.targetCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${isBountyComplete ? "bg-emerald-500" : "bg-amber-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (progress / activeQuest.bounty.targetCount) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {isBountyComplete && (
            <button
              onClick={() => onCompleteQuest(activeQuest)}
              className="mt-3 w-full py-2.5 rounded-lg font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
            >
              <SwordIcon size={16} />
              Complete Contract
            </button>
          )}
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {displayQuests.length > 0 ? (
          displayQuests.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`fantasy-card p-5 bg-slate-900/60 border-amber-500/20 hover:border-amber-500/40 transition-all group ${activeQuestId === quest.id ? "ring-2 ring-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-900/10" : ""
                }`}
            >
              <div className="mb-3">
                <h3 className="font-bold text-lg text-amber-100 group-hover:text-white transition-colors">
                  {quest.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase tracking-wider">
                    {quest.region}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                    Min Lvl {quest.minLevel}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <XPIcon size={10} /> +{quest.xpReward || 0} XP
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <GoldIcon size={10} /> +{quest.goldReward || 0} G
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-4 italic">
                "{quest.description}"
              </p>

              {/* Bounty Progress Display */}
              {quest.bounty && (
                <div className="mb-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-400 flex items-center gap-1.5 capitalize">
                      <SwordIcon size={12} className="text-amber-500" />
                      Kill {quest.bounty.targetCount} {quest.bounty.targetMonsterId.replace(/-/g, " ")}s
                    </span>
                    <span className={isBountyComplete && activeQuestId === quest.id ? "text-emerald-400" : "text-amber-400"}>
                      {activeQuestId === quest.id ? `${progress} / ${quest.bounty.targetCount}` : `0 / ${quest.bounty.targetCount}`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isBountyComplete && activeQuestId === quest.id ? "bg-emerald-500" : "bg-amber-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${activeQuestId === quest.id ? Math.min(100, (progress / quest.bounty.targetCount) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {activeQuestId === quest.id ? (
                <button
                  onClick={() => isBountyComplete && onCompleteQuest(quest)}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${isBountyComplete
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <SwordIcon size={16} />
                  {isBountyComplete ? "Complete Contract" : "Task in Progress..."}
                </button>
              ) : (
                <button
                  onClick={() => onAcceptQuest(quest)}
                  className="w-full py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all"
                >
                  <SwordIcon size={16} />
                  Accept Contract
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed p-8">
            <div className="text-4xl mb-3 opacity-20">📜</div>
            <p className="text-sm font-medium">No contracts currently available in this region.</p>
            <p className="text-xs opacity-60 mt-1">Complete current objectives or increase your level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
