import type { InventoryItem } from "../types/game";

export type CharacterClass = "mage" | "warrior" | "priest" | "rogue" | "archer";

export interface Character {
  id: number;
  createdAt: number;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicPower: number;
  speed: number;
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
  questState: "list" | "map" | "active" | "battle" | "result";
}

const STORAGE_KEY = "viberpg-characters";

function getStoredCharacters(): Character[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse characters from localStorage", e);
    return [];
  }
}

function saveCharacters(characters: Character[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

export async function getAllCharacters(): Promise<Character[]> {
  // We return a promise to keep the same interface as IndexedDB
  return getStoredCharacters().sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCurrentCharacter(): Promise<Character | null> {
  const chars = await getAllCharacters();
  return chars.length > 0 ? chars[0] : null;
}

export async function deleteCharacter(id: number): Promise<void> {
  const chars = getStoredCharacters();
  const filtered = chars.filter(c => c.id !== id);
  saveCharacters(filtered);
}

export async function createCharacter(character: Omit<Character, "id" | "createdAt">): Promise<Character> {
  const record: Character = {
    ...character,
    id: Date.now() + Math.floor(Math.random() * 1000),
    createdAt: Date.now(),
  };

  const chars = getStoredCharacters();
  chars.push(record);
  saveCharacters(chars);

  return record;
}

export async function updateCharacter(character: Character): Promise<Character> {
  const chars = getStoredCharacters();
  const index = chars.findIndex(c => c.id === character.id);
  if (index !== -1) {
    chars[index] = character;
    saveCharacters(chars);
  }
  return character;
}
