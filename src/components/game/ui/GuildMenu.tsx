import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character, Quest } from "../../../types/game";
import { GuildEvolution } from "./GuildEvolution";
import { QuestBoard } from "./QuestBoard";
import { RankIcon, SwordIcon } from "./GameIcons";

interface GuildMenuProps {
  character: Character;
  completedQuests: string[];
  activeQuestId?: string | null;
  onEvolve: (updatedCharacter: Character) => void;
  onAcceptQuest: (quest: Quest) => void;
  onCompleteQuest: (quest: Quest) => void;
  onClose: () => void;
}

export function GuildMenu({ character, completedQuests, activeQuestId, onEvolve, onAcceptQuest, onCompleteQuest, onClose }: GuildMenuProps) {
  const [activeTab, setActiveTab] = useState<"ranking" | "quests">("ranking");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950/20 rounded-2xl border border-white/5 p-4 md:p-6 backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-4 md:mb-8 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-700/30 w-full sm:w-max mx-auto shadow-inner shadow-black/20">
        <button
          onClick={() => setActiveTab("ranking")}
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
            activeTab === "ranking"
              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/30"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <RankIcon size={16} />
          Guild Ranking
        </button>
        <button
          onClick={() => setActiveTab("quests")}
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
            activeTab === "quests"
              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/30"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <SwordIcon size={16} />
          Quest Board
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "ranking" ? (
             <motion.div
               key="ranking"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               transition={{ duration: 0.2 }}
               className="h-full"
             >
               <GuildEvolution 
                 character={character} 
                 onEvolve={onEvolve} 
                 onClose={onClose} 
               />
             </motion.div>
          ) : (
             <motion.div
                key="quests"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="h-full"
             >
                <QuestBoard 
                  character={character} 
                  completedQuests={completedQuests} 
                  onAcceptQuest={onAcceptQuest}
                  onCompleteQuest={onCompleteQuest}
                  activeQuestId={activeQuestId}
                />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
