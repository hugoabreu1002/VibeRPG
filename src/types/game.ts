import type { CharacterClass } from "../lib/storage";
export type { CharacterClass };

export type Tab = "Inventory" | "World Map" | "Quests" | "Shop" | "Guild" | "Quest Board";

export type QuestState = "list" | "map" | "active" | "battle" | "result";

export type TileType = "grass" | "path" | "water" | "mountain" | "forest" | "town" | "cave" | "lava";

export interface NPC {
  id: string;
  name: string;
  position: { x: number; y: number };
  sprite: string;
  dialog: string[];
  questId?: string;
}

export interface QuestMapData {
  width: number;
  height: number;
  tiles: TileType[][];
  npcs: NPC[];
  playerStart: { x: number; y: number };
  name: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magicPower: number;
  xpReward: number;
  goldReward: number;
  description: string;
  sprite: string;
  battleTheme?: string;
}

export interface QuestChoice {
  text: string;
  requiredStat: "attack" | "magicPower" | "defense";
  difficulty: number;
  successMessage: string;
  failureMessage: string;
  xpReward: number;
  goldReward: number;
  rewardItemId?: string;
  rewardSkill?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  class: CharacterClass;
  choices?: QuestChoice[];
  rewardSkill?: string;
  minLevel: number;
  region: string;
  bounty?: {
    targetMonsterId: string;
    targetCount: number;
  };
  xpReward: number;
  goldReward: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "boot" | "hat" | "food";
  rarity: "common" | "rare" | "epic" | "legendary";
  price: number;
  stats: {
    attack?: number;
    defense?: number;
    magicPower?: number;
    hp?: number;
    mp?: number;
  };
  restores?: {
    hp?: number;
    mp?: number;
  };
  equipped: boolean;
  description: string;
  allowedClasses?: CharacterClass[];
}

export interface Character {
  id: number;
  createdAt: number;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicPower: number;
  speed: number;
  xpToNext: number;
  rank: "F" | "E" | "D" | "C" | "B" | "A" | "S";
  skills: string[];
  inventory: InventoryItem[];
  completedQuests: string[];
  acceptedQuests: string[];
  currentRegion: string;
  discoveredTiles?: Record<string, string[]>;
  skinColor?: string;
  hairColor?: string;
  clothingColor?: string;
  faceStyle?: "heroic" | "friendly" | "fierce" | "mysterious";
  activeQuestId?: string;
  questState: QuestState;
  questProgress?: Record<string, number>;
}
export interface QuestResult {
  success: boolean;
  message: string;
  xp: number;
  gold: number;
  rewardItem?: InventoryItem;
  rewardSkill?: string;
}
