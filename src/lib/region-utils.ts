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
    availableQuests: ["guild-bounty-slimes", "guild-bounty-rats", "guild-bounty-undead"],
    nextRegions: ["Northern Village", "Whispering Woods", "Mountain Pass"],
    requiredQuestsToComplete: 1 // Tutorial region - quick progression
  },
  "Northern Village": {
    id: "Northern Village",
    name: "Northern Village",
    description: "A peaceful village under threat from bandits and monsters.",
    unlockedBy: ["mage-library", "warrior-village", "priest-plague"],
    availableQuests: ["mage-library", "warrior-village", "priest-plague"],
    nextRegions: ["Trade Route", "Training Grounds", "Dark Forest"],
    requiredQuestsToComplete: 2 // Complete 2 of 3 quests to advance
  },
  "Whispering Woods": {
    id: "Whispering Woods",
    name: "Whispering Woods",
    description: "Ancient forest filled with magical creatures and hidden dangers.",
    unlockedBy: ["mage-apprentice", "warrior-village", "priest-plague"],
    availableQuests: ["mage-apprentice"],
    nextRegions: ["Crystal Caverns", "Shadow Tower"]
  },
  "Mountain Pass": {
    id: "Mountain Pass",
    name: "Mountain Pass",
    description: "Treacherous mountain path guarded by earth elementals.",
    unlockedBy: ["mage-elemental", "warrior-village", "priest-plague"],
    availableQuests: ["mage-elemental"],
    nextRegions: ["Dragon Peak"]
  },
  "Trade Route": {
    id: "Trade Route",
    name: "Trade Route",
    description: "Dangerous road plagued by wolf packs and bandits.",
    unlockedBy: ["warrior-monster", "mage-library", "priest-plague"],
    availableQuests: ["warrior-monster"],
    nextRegions: []
  },
  "Training Grounds": {
    id: "Training Grounds",
    name: "Training Grounds",
    description: "Arena where warriors test their skills against honorable opponents.",
    unlockedBy: ["warrior-duel", "mage-library", "priest-plague"],
    availableQuests: ["warrior-duel"],
    nextRegions: []
  },
  "Dark Forest": {
    id: "Dark Forest",
    name: "Dark Forest",
    description: "Foreboding woods where orcs have set up their war camp.",
    unlockedBy: ["warrior-orc-camp", "mage-library", "priest-plague"],
    availableQuests: ["warrior-orc-camp"],
    nextRegions: []
  },
  "Dragon Peak": {
    id: "Dragon Peak",
    name: "Dragon Peak",
    description: "Mountain peak where a wyvern has made its lair.",
    unlockedBy: ["warrior-dragon-lair"],
    availableQuests: ["warrior-dragon-lair"],
    nextRegions: []
  },
  "Crystal Caverns": {
    id: "Crystal Caverns",
    name: "Crystal Caverns",
    description: "Ancient caves filled with magical crystals and dangerous creatures.",
    unlockedBy: ["mage-crystalcave"],
    availableQuests: ["mage-crystalcave"],
    nextRegions: []
  },
  "Shadow Tower": {
    id: "Shadow Tower",
    name: "Shadow Tower",
    description: "Ancient watchtower corrupted by a rogue mage's dark experiments.",
    unlockedBy: ["mage-tower"],
    availableQuests: ["mage-tower"],
    nextRegions: []
  },
  "Southern Village": {
    id: "Southern Village",
    name: "Southern Village",
    description: "Village suffering from a mysterious plague.",
    unlockedBy: ["priest-plague"],
    availableQuests: ["priest-plague"],
    nextRegions: ["Abandoned Church", "Sacred Catacombs", "Cursed Ruins"]
  },
  "Abandoned Church": {
    id: "Abandoned Church",
    name: "Abandoned Church",
    description: "Old church haunted by a restless spirit.",
    unlockedBy: ["priest-ghost"],
    availableQuests: ["priest-ghost"],
    nextRegions: []
  },
  "Sacred Catacombs": {
    id: "Sacred Catacombs",
    name: "Sacred Catacombs",
    description: "Underground crypts where undead creatures have broken free.",
    unlockedBy: ["priest-undead-crypt"],
    availableQuests: ["priest-undead-crypt"],
    nextRegions: []
  },
  "Cursed Ruins": {
    id: "Cursed Ruins",
    name: "Cursed Ruins",
    description: "Ancient ruins where a demon portal has opened.",
    unlockedBy: ["priest-demon-portal"],
    availableQuests: ["priest-demon-portal"],
    nextRegions: []
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

    // Check level requirement
    if (quest.minLevel > character.level) return false;

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

    // Check level requirement
    if (quest.minLevel > character.level) return false;

    return true;
  });

  const completedInRegion = validQuests.filter(questId => completedQuests.includes(questId)).length;

  return {
    current: completedInRegion,
    total: validQuests.length,
    percentage: validQuests.length > 0 ? Math.round((completedInRegion / validQuests.length) * 100) : 0
  };
}
