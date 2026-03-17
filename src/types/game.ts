import type { CharacterClass } from "../lib/indexeddb";

export type Tab = "Overview" | "Quests" | "Shop";

export type QuestState = "list" | "active" | "battle" | "result";

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
}

export interface QuestChoice {
  text: string;
  requiredStat: "attack" | "magicPower" | "defense";
  difficulty: number;
  successMessage: string;
  failureMessage: string;
  xpReward: number;
  goldReward: number;
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
}

export interface QuestResult {
  success: boolean;
  message: string;
  xp: number;
  gold: number;
}
