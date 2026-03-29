import type { Character, Quest, QuestChoice, QuestResult, QuestState, InventoryItem } from "../types/game";
import { QUESTS, getQuestEnemy, ENEMIES, ALL_ITEMS } from "./game-data";
import { updateCharacter } from "./storage";
import { getAvailableRegions, getAvailableQuestsForRegion, getRegionProgress } from "./region-utils";
import { QUEST_MAPS } from "./map-data";

export interface QuestService {
  // Quest Management
  getAvailableQuests(character: Character): Quest[];
  getActiveQuest(character: Character): Quest | null;
  startQuest(character: Character, questId: string): Promise<{ success: boolean; message: string; quest?: Quest }>;
  attemptQuestChoice(character: Character, choice: QuestChoice): Promise<{ success: boolean; result: QuestResult }>;
  completeQuest(character: Character, result: QuestResult): Promise<Character>;
  resetQuest(character: Character): Promise<Character>;

  // Progress Tracking
  getQuestProgress(character: Character): { current: number; total: number; percentage: number };
  getRegionProgress(character: Character): { current: number; total: number; percentage: number };
  getAvailableRegions(character: Character): string[];

  // NPC Interaction
  interactWithNPC(character: Character, npcId: string): Promise<{ success: boolean; message: string; quest?: Quest }>;
  canAcceptQuest(character: Character, quest: Quest): boolean;
}

class QuestServiceImpl implements QuestService {
  // Quest Management
  getAvailableQuests(character: Character): Quest[] {
    const availableRegions = getAvailableRegions(character);
    const allAvailableQuests: Quest[] = [];

    availableRegions.forEach(region => {
      const regionQuests = getAvailableQuestsForRegion(region.id, character);
      regionQuests.forEach(questId => {
        const quest = QUESTS.find(q => q.id === questId);
        if (quest && this.canAcceptQuest(character, quest)) {
          allAvailableQuests.push(quest);
        }
      });
    });

    return allAvailableQuests;
  }

  getActiveQuest(character: Character): Quest | null {
    if (!character.activeQuestId) return null;
    return QUESTS.find(q => q.id === character.activeQuestId) || null;
  }

  async startQuest(character: Character, questId: string): Promise<{ success: boolean; message: string; quest?: Quest }> {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) {
      return { success: false, message: "Quest not found" };
    }

    // Check if there's already an active quest - must finish before starting another
    if (character.activeQuestId) {
      return { success: false, message: "You must complete your current quest before starting a new one" };
    }

    if (!this.canAcceptQuest(character, quest)) {
      return { success: false, message: "Cannot accept this quest" };
    }

    // Check if already completed
    if (character.completedQuests.includes(questId)) {
      return { success: false, message: "Quest already completed" };
    }

    // Update character with active quest
    const updatedCharacter = {
      ...character,
      activeQuestId: questId,
      questState: "active" as QuestState,
      acceptedQuests: [...(character.acceptedQuests || []), questId]
    };

    try {
      await updateCharacter(updatedCharacter);
      return { success: true, message: "Quest started", quest };
    } catch (error) {
      console.error("Failed to start quest:", error);
      return { success: false, message: "Failed to start quest" };
    }
  }

  async attemptQuestChoice(character: Character, choice: QuestChoice): Promise<{ success: boolean; result: QuestResult }> {
    const activeQuest = this.getActiveQuest(character);
    if (!activeQuest) {
      throw new Error("No active quest");
    }

    // Calculate success based on required stat
    const requiredStat = choice.requiredStat;
    const characterStat = character[requiredStat];
    const difficulty = choice.difficulty;

    // Add some randomness to the check
    const randomFactor = Math.random() * 10;
    const success = characterStat + randomFactor >= difficulty;

    const result: QuestResult = {
      success,
      message: success ? choice.successMessage : choice.failureMessage,
      xp: success ? choice.xpReward : 0,
      gold: success ? choice.goldReward : 0,
      rewardItem: success && choice.rewardItemId ? this.getRewardItem(choice.rewardItemId) : undefined,
      rewardSkill: success && choice.rewardSkill ? choice.rewardSkill : undefined
    };

    return { success, result };
  }

  async completeQuest(character: Character, result: QuestResult): Promise<Character> {
    if (!character.activeQuestId) {
      throw new Error("No active quest to complete");
    }

    // Check if quest was already completed - prevent duplicate rewards
    if (character.completedQuests.includes(character.activeQuestId)) {
      // Quest already completed, just clear active quest without giving rewards again
      const updatedCharacter = {
        ...character,
        activeQuestId: null,
        questState: "result" as QuestState
      };
      return await updateCharacter(updatedCharacter);
    }

    // Add rewards to character
    let updatedCharacter = {
      ...character,
      xp: character.xp + result.xp,
      gold: character.gold + result.gold,
      questState: "result" as QuestState
    };

    // Add completed quest to list
    updatedCharacter.completedQuests = [...updatedCharacter.completedQuests, character.activeQuestId];

    // Clear active quest
    updatedCharacter.activeQuestId = null;

    // Add reward item if any
    if (result.rewardItem) {
      updatedCharacter.inventory = [...updatedCharacter.inventory, result.rewardItem];
    }

    // Add reward skill if any
    if (result.rewardSkill && !updatedCharacter.skills.includes(result.rewardSkill)) {
      updatedCharacter.skills = [...updatedCharacter.skills, result.rewardSkill];
    }

    // Update character in storage
    try {
      const savedCharacter = await updateCharacter(updatedCharacter);
      return savedCharacter;
    } catch (error) {
      console.error("Failed to complete quest:", error);
      throw error;
    }
  }

  async resetQuest(character: Character): Promise<Character> {
    const updatedCharacter = {
      ...character,
      activeQuestId: null,
      questState: "list" as QuestState
    };

    try {
      return await updateCharacter(updatedCharacter);
    } catch (error) {
      console.error("Failed to reset quest:", error);
      throw error;
    }
  }

  // Progress Tracking
  getQuestProgress(character: Character): { current: number; total: number; percentage: number } {
    const availableQuests = this.getAvailableQuests(character);
    const completedInAvailable = availableQuests.filter(quest =>
      character.completedQuests.includes(quest.id)
    ).length;

    return {
      current: completedInAvailable,
      total: availableQuests.length,
      percentage: availableQuests.length > 0 ? Math.round((completedInAvailable / availableQuests.length) * 100) : 0
    };
  }

  getRegionProgress(character: Character): { current: number; total: number; percentage: number } {
    const currentRegion = character.currentRegion;
    const availableQuests = getAvailableQuestsForRegion(currentRegion, character);
    const completedInRegion = availableQuests.filter(questId =>
      character.completedQuests.includes(questId)
    ).length;

    return {
      current: completedInRegion,
      total: availableQuests.length,
      percentage: availableQuests.length > 0 ? Math.round((completedInRegion / availableQuests.length) * 100) : 0
    };
  }

  getAvailableRegions(character: Character): string[] {
    return getAvailableRegions(character).map(region => region.id);
  }

  // NPC Interaction
  async interactWithNPC(character: Character, npcId: string): Promise<{ success: boolean; message: string; quest?: Quest }> {
    // Find the NPC in the current region's map
    const mapData = await this.getQuestMapForRegion(character.currentRegion);
    if (!mapData) {
      return { success: false, message: "No map data for current region" };
    }

    const npc = mapData.npcs.find(n => n.id === npcId);
    if (!npc) {
      return { success: false, message: "NPC not found" };
    }

    // If NPC has a quest
    if (npc.questId) {
      const quest = QUESTS.find(q => q.id === npc.questId);
      if (quest) {
        // Check if quest is already completed
        if (character.completedQuests.includes(npc.questId)) {
          return { success: false, message: "Quest already completed", quest };
        }

        // Start the quest
        return this.startQuest(character, npc.questId);
      }
    }

    return { success: true, message: "NPC interaction completed" };
  }

  canAcceptQuest(character: Character, quest: Quest): boolean {
    // Check class requirement
    if (quest.class !== character.class) {
      return false;
    }

    // Check level requirement
    if (quest.minLevel > character.level) {
      return false;
    }

    // Check if already completed
    if (character.completedQuests.includes(quest.id)) {
      return false;
    }

    return true;
  }

  // Helper methods
  private getRewardItem(itemId: string): InventoryItem | undefined {
    return this.getAllItems().find(item => item.id === itemId);
  }

  private getAllItems(): InventoryItem[] {
    // Return all reward items from game data
    return ALL_ITEMS;
  }

  private getQuestMapForRegion(regionId: string): any {
    // Use the actual map data from map-data.ts
    return QUEST_MAPS[regionId] || null;
  }
}

// Export singleton instance
export const questService = new QuestServiceImpl();
