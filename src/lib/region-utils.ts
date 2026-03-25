import type { Character } from "../types/game";
import { QUESTS } from "./game-data";
import { getQuestMap } from "./map-data";

export interface Region {
  id: string;
  name: string;
  description: string;
  unlockedBy: string[]; // Quest IDs that unlock this region
  availableQuests: string[]; // Quest IDs available in this region
  nextRegions: string[]; // Region IDs that can be unlocked from this region
  requiredQuestsToComplete?: number; // Number of quests needed to advance (default: all)
}

// Define region progression
export const REGIONS: Record<string, Region> = {
  "Hub Town": {
    id: "Hub Town",
    name: "Hub Town",
    description: "The central town where adventurers gather. All classes start here.",
    unlockedBy: [],
    availableQuests: ["guild-bounty-slimes", "guild-bounty-rats", "guild-bounty-undead", "mage-apprentice", "warrior-village", "priest-plague"],
    nextRegions: ["Whispering Woods", "Trade Route", "Abandoned Church"],
    requiredQuestsToComplete: 1 // Tutorial region - quick progression
  },
  "Northern Village": {
    id: "Northern Village",
    name: "Northern Village",
    description: "A peaceful village under threat from bandits and monsters.",
    unlockedBy: ["priest-ghost"], // Priest unlocks this after ghost. Warrior doesn't need to visit this for next quest, but can.
    availableQuests: ["warrior-village", "priest-blessing"],
    nextRegions: ["Trade Route", "Sacred Catacombs"],
    requiredQuestsToComplete: 1
  },
  "Whispering Woods": {
    id: "Whispering Woods",
    name: "Whispering Woods",
    description: "Ancient forest filled with magical creatures and hidden dangers.",
    unlockedBy: ["mage-apprentice"],
    availableQuests: ["mage-apprentice", "mage-library"],
    nextRegions: ["Mountain Pass"],
    requiredQuestsToComplete: 1
  },
  "Mountain Pass": {
    id: "Mountain Pass",
    name: "Mountain Pass",
    description: "Treacherous mountain path guarded by earth elementals.",
    unlockedBy: ["mage-library"],
    availableQuests: ["mage-elemental"],
    nextRegions: ["Crystal Caverns"],
    requiredQuestsToComplete: 1
  },
  "Trade Route": {
    id: "Trade Route",
    name: "Trade Route",
    description: "Dangerous road plagued by wolf packs and bandits.",
    unlockedBy: ["warrior-village"],
    availableQuests: ["warrior-monster"],
    nextRegions: ["Training Grounds"],
    requiredQuestsToComplete: 1
  },
  "Training Grounds": {
    id: "Training Grounds",
    name: "Training Grounds",
    description: "Arena where warriors test their skills against honorable opponents.",
    unlockedBy: ["warrior-monster"],
    availableQuests: ["warrior-duel"],
    nextRegions: ["Dark Forest"],
    requiredQuestsToComplete: 1
  },
  "Dark Forest": {
    id: "Dark Forest",
    name: "Dark Forest",
    description: "Foreboding woods where orcs have set up their war camp.",
    unlockedBy: ["warrior-duel"],
    availableQuests: ["warrior-orc-camp"],
    nextRegions: ["Dragon Peak"],
    requiredQuestsToComplete: 1
  },
  "Dragon Peak": {
    id: "Dragon Peak",
    name: "Dragon Peak",
    description: "Mountain peak where a wyvern has made its lair.",
    unlockedBy: ["warrior-orc-camp"],
    availableQuests: ["warrior-dragon-lair"],
    nextRegions: [],
    requiredQuestsToComplete: 1
  },
  "Crystal Caverns": {
    id: "Crystal Caverns",
    name: "Crystal Caverns",
    description: "Ancient caves filled with magical crystals and dangerous creatures.",
    unlockedBy: ["mage-elemental"],
    availableQuests: ["mage-crystalcave"],
    nextRegions: ["Shadow Tower"],
    requiredQuestsToComplete: 1
  },
  "Shadow Tower": {
    id: "Shadow Tower",
    name: "Shadow Tower",
    description: "Ancient watchtower corrupted by a rogue mage's dark experiments.",
    unlockedBy: ["mage-crystalcave"],
    availableQuests: ["mage-tower"],
    nextRegions: [],
    requiredQuestsToComplete: 1
  },
  "Southern Village": {
    id: "Southern Village",
    name: "Southern Village",
    description: "Village suffering from a mysterious plague.",
    unlockedBy: ["priest-plague"],
    availableQuests: ["priest-plague"],
    nextRegions: ["Abandoned Church"],
    requiredQuestsToComplete: 1
  },
  "Abandoned Church": {
    id: "Abandoned Church",
    name: "Abandoned Church",
    description: "Old church haunted by a restless spirit.",
    unlockedBy: ["priest-plague"],
    availableQuests: ["priest-ghost"],
    nextRegions: ["Northern Village"],
    requiredQuestsToComplete: 1
  },
  "Sacred Catacombs": {
    id: "Sacred Catacombs",
    name: "Sacred Catacombs",
    description: "Underground crypts where undead creatures have broken free.",
    unlockedBy: ["priest-blessing"],
    availableQuests: ["priest-undead-crypt"],
    nextRegions: ["Cursed Ruins"],
    requiredQuestsToComplete: 1
  },
  "Cursed Ruins": {
    id: "Cursed Ruins",
    name: "Cursed Ruins",
    description: "Ancient ruins where a demon portal has opened.",
    unlockedBy: ["priest-undead-crypt"],
    availableQuests: ["priest-demon-portal"],
    nextRegions: [],
    requiredQuestsToComplete: 1
  }
};

// Guild regions (repeatable quests)
export const GUILD_REGIONS: Record<string, Region> = {
  "Eastern Farmlands": {
    id: "Eastern Farmlands",
    name: "Eastern Farmlands",
    description: "Farmlands plagued by slime infestations.",
    unlockedBy: [],
    availableQuests: ["guild-bounty-slimes"],
    nextRegions: []
  },
  "Tavern Cellar": {
    id: "Tavern Cellar",
    name: "Tavern Cellar",
    description: "Tavern basement overrun with giant rats.",
    unlockedBy: [],
    availableQuests: ["guild-bounty-rats"],
    nextRegions: []
  },
  "Old Graveyard": {
    id: "Old Graveyard",
    name: "Old Graveyard",
    description: "Graveyard haunted by wandering skeletons.",
    unlockedBy: [],
    availableQuests: ["guild-bounty-undead"],
    nextRegions: []
  },
  "Forest Path": {
    id: "Forest Path",
    name: "Forest Path",
    description: "Dangerous forest path where merchants need protection.",
    unlockedBy: [],
    availableQuests: ["guild-escort-merchant"],
    nextRegions: []
  },
  "Poison Swamp": {
    id: "Poison Swamp",
    name: "Poison Swamp",
    description: "Toxic swamp where rare herbs grow.",
    unlockedBy: [],
    availableQuests: ["guild-herb-gathering"],
    nextRegions: []
  },
  "Crystal Caverns": {
    id: "Crystal Caverns",
    name: "Crystal Caverns",
    description: "Caves rumored to contain lost treasure.",
    unlockedBy: [],
    availableQuests: ["guild-treasure-hunt"],
    nextRegions: []
  },
  "Mountain Pass": {
    id: "Mountain Pass",
    name: "Mountain Pass",
    description: "Pass terrorized by a powerful beast.",
    unlockedBy: [],
    availableQuests: ["guild-monster-hunt"],
    nextRegions: []
  },
  "Mystic Grove": {
    id: "Mystic Grove",
    name: "Mystic Grove",
    description: "Magical grove where wild spirits roam.",
    unlockedBy: [],
    availableQuests: ["guild-arcane-research"],
    nextRegions: []
  }
};

export function getCurrentRegion(character: Character): Region {
  return REGIONS[character.currentRegion] || REGIONS["Hub Town"];
}

export function getAvailableRegions(character: Character): Region[] {
  const completedQuests = character.completedQuests;
  const unlockedRegions: Region[] = [];

  // Always include Hub Town
  unlockedRegions.push(REGIONS["Hub Town"]);

  // Check each region to see if it's unlocked
  Object.values(REGIONS).forEach(region => {
    if (region.id === "Hub Town") return; // Already added

    // Check if all required quests are completed
    const isUnlocked = region.unlockedBy.every(questId => completedQuests.includes(questId));

    if (isUnlocked) {
      unlockedRegions.push(region);
    }
  });

  return unlockedRegions;
}

export function getAvailableQuestsForRegion(regionId: string, character: Character): string[] {
  const region = REGIONS[regionId];
  if (!region) return [];

  // Filter quests by class and level requirements
  return region.availableQuests.filter(questId => {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return false;

    // Check class requirement
    if (quest.class !== character.class) return false;

    // Check if already completed
    if (character.completedQuests.includes(questId)) return false;

    return true;
  });
}


export function getNextAvailableRegions(character: Character): Region[] {
  const currentRegion = getCurrentRegion(character);
  const completedQuests = character.completedQuests;

  // Find regions that can be unlocked from current region
  const nextRegions: Region[] = [];

  currentRegion.nextRegions.forEach(regionId => {
    const region = REGIONS[regionId];
    if (!region) return;

    // Check if ANY required quest is completed (OR logic for class-specific quests)
    const isUnlocked = region.unlockedBy.length === 0 ||
      region.unlockedBy.some(questId => completedQuests.includes(questId));

    if (isUnlocked) {
      nextRegions.push(region);
    }
  });

  return nextRegions;
}

export function shouldAutoAdvanceRegion(character: Character): boolean {
  const currentRegion = getCurrentRegion(character);
  const completedRegionQuests = currentRegion.availableQuests.filter(
    questId => character.completedQuests.includes(questId)
  );
  const requiredCount = currentRegion.requiredQuestsToComplete ?? currentRegion.availableQuests.length;

  // Check if player has completed enough quests to advance
  if (completedRegionQuests.length >= requiredCount) {
    const nextRegions = getNextAvailableRegions(character);
    return nextRegions.length > 0;
  }

  return false;
}

export function getRegionMapData(regionId: string) {
  return getQuestMap(regionId);
}


export function getRegionProgress(character: Character): { current: number; total: number; percentage: number } {
  const currentRegion = getCurrentRegion(character);
  const allRegionQuests = currentRegion.availableQuests;
  const completedQuests = character.completedQuests;

  // Count all quests in the region that match the character's class and level
  const validQuests = allRegionQuests.filter(questId => {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return false;

    // Check class requirement
    if (quest.class !== character.class) return false;

    return true;
  });

  const completedInRegion = validQuests.filter(questId => completedQuests.includes(questId)).length;

  return {
    current: completedInRegion,
    total: validQuests.length,
    percentage: validQuests.length > 0 ? Math.round((completedInRegion / validQuests.length) * 100) : 0
  };
}
