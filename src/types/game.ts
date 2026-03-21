import type { CharacterClass } from "../lib/storage";
export type { CharacterClass };

export type Tab = "Inventory" | "World Map" | "Quests" | "Shop";

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
  choices: QuestChoice[];
  minLevel: number;
  region: string;
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
  xpToNext: number;
  skills: string[];
  inventory: InventoryItem[];
  completedQuests: string[];
}

export interface QuestResult {
  success: boolean;
  message: string;
  xp: number;
  gold: number;
  rewardItem?: InventoryItem;
  rewardSkill?: string;
}
