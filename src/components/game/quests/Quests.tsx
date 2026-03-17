import { motion } from "framer-motion";
import type { Character, Quest, QuestChoice, QuestState, QuestResult } from "../../../types/game";

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
      className="rounded-xl bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quests</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
            {character.class === 'mage' && '🔮'}
            {character.class === 'warrior' && '⚔️'}
            {character.class === 'priest' && '⛑️'}
            {' '}{character.class.toUpperCase()} Quests
          </span>
        </div>
      </div>

      {questState === "list" && (
        <div className="space-y-4">
          {availableQuests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-2">🎉 All quests completed!</p>
              <p className="text-sm text-slate-400">Check back later for more adventures.</p>
            </div>
          ) : (
            availableQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{quest.title}</h3>
                    <p className="text-xs text-slate-500">{quest.region} • Lv. {quest.minLevel}+</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStartQuest(quest)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Start
                  </motion.button>
                </div>
                <p className="text-sm text-slate-600 mb-3">{quest.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {quest.choices.map((choice, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {choice.requiredStat === 'attack' && '⚔️'}
                      {choice.requiredStat === 'magicPower' && '🔮'}
                      {choice.requiredStat === 'defense' && '🛡️'}
                      {' '}{choice.difficulty}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {questState === "active" && activeQuest && (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onResetQuest}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Quest List
          </motion.button>

          <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{activeQuest.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{activeQuest.description}</p>

            <p className="text-sm font-medium mb-3">How will you approach this?</p>

            <div className="space-y-2">
              {activeQuest.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onAttemptChoice(choice)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{choice.text}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                        {choice.requiredStat === 'attack' && '⚔️'}
                        {choice.requiredStat === 'magicPower' && '🔮'}
                        {choice.requiredStat === 'defense' && '🛡️'}
                        {' '}{choice.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {questState === "result" && questResult && (
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-lg p-6 text-center ${questResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
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

            <h3 className={`text-lg font-bold mb-2 ${questResult.success ? "text-green-700" : "text-red-700"
              }`}>
              {questResult.success ? "Quest Complete!" : "Quest Failed"}
            </h3>

            <p className="text-sm text-slate-600 mb-4">{questResult.message}</p>

            {questResult.success && (
              <div className="flex justify-center gap-4">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  +{questResult.xp} XP
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm"
                >
                  +{questResult.gold} Gold
                </motion.span>
              </div>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResetQuest}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Continue
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
