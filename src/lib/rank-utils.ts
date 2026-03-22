import { Character } from "../types/game";

export type Rank = "F" | "E" | "D" | "C" | "B" | "A" | "S";

export interface RankData {
  rank: Rank;
  cost: number;
  minLevel: number;
  label: string;
  color: string;
  glow: string;
}

export const RANKS: RankData[] = [
  { rank: "F", cost: 0, minLevel: 1, label: "Novice (Rank F)", color: "#94A3B8", glow: "transparent" },
  { rank: "E", cost: 1000, minLevel: 5, label: "Apprentice (Rank E)", color: "#10B981", glow: "rgba(16, 185, 129, 0.2)" },
  { rank: "D", cost: 5000, minLevel: 10, label: "Soldier (Rank D)", color: "#3B82F6", glow: "rgba(59, 130, 246, 0.3)" },
  { rank: "C", cost: 10000, minLevel: 20, label: "Veteran (Rank C)", color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)" },
  { rank: "B", cost: 20000, minLevel: 30, label: "Knight (Rank B)", color: "#EC4899", glow: "rgba(236, 72, 153, 0.5)" },
  { rank: "A", cost: 40000, minLevel: 45, label: "Hero (Rank A)", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.6)" },
  { rank: "S", cost: 100000, minLevel: 60, label: "Legend (Rank S)", color: "#EF4444", glow: "rgba(239, 68, 68, 0.8)" },
];

export function getNextRank(currentRank: Rank): RankData | null {
  const currentIndex = RANKS.findIndex(r => r.rank === currentRank);
  if (currentIndex === -1 || currentIndex === RANKS.length - 1) return null;
  return RANKS[currentIndex + 1];
}

export function canEvolve(character: Character): { can: boolean; reason?: string } {
  const nextRank = getNextRank(character.rank);
  if (!nextRank) return { can: false, reason: "You have reached the maximum rank!" };

  if (character.gold < nextRank.cost) {
    return { can: false, reason: `You need ${nextRank.cost.toLocaleString()} gold to evolve to ${nextRank.rank} rank!` };
  }

  if (character.level < nextRank.minLevel) {
    return { can: false, reason: `You need to be level ${nextRank.minLevel} to evolve to ${nextRank.rank} rank!` };
  }

  return { can: true };
}

export const CLASS_RANK_SKILLS: Record<string, Record<Rank, string[]>> = {
  mage: {
    F: ["bolt", "defend", "flee"],
    E: ["meteor"],
    D: [],
    C: ["thunderstorm"],
    B: [],
    A: [],
    S: ["black-hole"],
  },
  warrior: {
    F: ["slash", "defend", "flee"],
    E: ["cleave"],
    D: [],
    C: ["whirlwind"],
    B: [],
    A: [],
    S: ["heavenly-strike"],
  },
  priest: {
    F: ["smite", "defend", "flee"],
    E: ["holy-nova"],
    D: [],
    C: ["judgment"],
    B: [],
    A: [],
    S: ["gods-wrath"],
  },
  rogue: {
    F: ["stab", "defend", "flee"],
    E: ["eviscerate"],
    D: [],
    C: ["fan-of-knives"],
    B: [],
    A: [],
    S: ["shadow-strike"],
  }
};

export function getRankSkills(charClass: string, rank: Rank): string[] {
  const classSkills = CLASS_RANK_SKILLS[charClass] || CLASS_RANK_SKILLS.mage;
  const rankIndex = RANKS.findIndex(r => r.rank === rank);

  let allSkills: string[] = [];
  for (let i = 0; i <= rankIndex; i++) {
    const r = RANKS[i].rank;
    if (classSkills[r]) {
      allSkills = [...allSkills, ...classSkills[r]];
    }
  }

  return Array.from(new Set(allSkills));
}
