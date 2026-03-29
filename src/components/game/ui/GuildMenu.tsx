import { Character, Quest } from "../../../types/game";
import { GuildEvolution } from "./GuildEvolution";
import { RANKS, getNextRank, getRankSkills } from "../../../lib/rank-utils";

interface GuildMenuProps {
  character: Character;
  completedQuests: string[];
  activeQuestId?: string;
  onEvolve: (updatedCharacter: Character) => void;
  onAcceptQuest: (quest: Quest) => void;
  onCompleteQuest: (quest: Quest) => Promise<void>;
  onClose: () => void;
}

// Calculate evolution gains upfront
const calculateEvolutionGains = (character: Character) => {
  const nextRank = getNextRank(character.rank);
  if (!nextRank) return null;

  const currentSkills = getRankSkills(character.class, character.rank);
  const newAllSkills = getRankSkills(character.class, nextRank.rank);
  const newSkillsOnly = newAllSkills.filter(skill => !currentSkills.includes(skill));

  const statBoost = {
    maxHp: Math.floor(character.maxHp * 0.15) + 10,
    maxMp: Math.floor(character.maxMp * 0.15) + 5,
    attack: Math.floor(character.attack * 0.15) + 3,
    defense: Math.floor(character.defense * 0.15) + 3,
    magicPower: Math.floor(character.magicPower * 0.15) + 3,
  };

  return {
    nextRank,
    newSkillsOnly,
    statBoost,
  };
};

export function GuildMenu({ character, onEvolve, onClose }: GuildMenuProps) {
  const currentRankData = RANKS.find(r => r.rank === character.rank);
  const evolutionData = calculateEvolutionGains(character);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950/20 rounded-2xl border border-white/5 p-4 md:p-6 backdrop-blur-md">
      {/* Current Rank Display */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
        <h4 className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mb-3">Current Rank</h4>
        <div className="flex items-center gap-4">
          <div
            className="text-5xl font-black filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            style={{ color: currentRankData?.color }}
          >
            {character.rank}
          </div>
          <div>
            <div className="text-lg font-bold text-amber-100">{currentRankData?.label}</div>
            <div className="text-sm text-slate-400">Level {character.level}</div>
          </div>
        </div>
      </div>

      {/* Evolution Preview */}
      {evolutionData && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <h4 className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mb-4">
            Evolution to {evolutionData.nextRank.label}
          </h4>

          {/* Stat Boosts */}
          <div className="mb-4">
            <h5 className="text-xs font-bold text-emerald-400 mb-2">Stat Improvements</h5>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(evolutionData.statBoost).map(([stat, boost]) => (
                <div key={stat} className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-bold text-emerald-300">+{boost}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{stat.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* New Skills */}
          {evolutionData.newSkillsOnly.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-blue-400 mb-2">New Skills Unlocked</h5>
              <div className="space-y-2">
                {evolutionData.newSkillsOnly.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-blue-300 font-medium capitalize">{skill.replace(/-/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evolutionData.newSkillsOnly.length === 0 && (
            <div className="text-xs text-slate-500 italic">No new skills at this rank</div>
          )}
        </div>
      )}

      {/* Guild Evolution Component */}
      <div className="flex-1 overflow-y-auto">
        <GuildEvolution
          character={character}
          onEvolve={onEvolve}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
