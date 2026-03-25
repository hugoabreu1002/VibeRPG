import type { Character, Quest, QuestChoice, InventoryItem, QuestState } from "../types/game";
import { QUESTS, ALL_ITEMS } from "./game-data";
import { updateCharacter } from "./storage";
import { audioManager } from "./audio";
import { shouldAutoAdvanceRegion, getNextAvailableRegions, getCurrentRegion, REGIONS } from "./region-utils";

export interface QuestLogicResult {
    success: boolean;
    message: string;
    updatedCharacter?: Character;
    leveledUp?: boolean;
    rewardItem?: InventoryItem;
    rewardSkill?: string;
    redirectToShop?: boolean;
}

export async function acceptQuestFromNPC(
    character: Character,
    quest: Quest
): Promise<{ success: boolean; updatedCharacter: Character }> {
    // Check if quest is already completed
    if (character.completedQuests.includes(quest.id)) {
        return { success: false, updatedCharacter: character };
    }

    // Add quest to acceptedQuests if not already there
    const newAcceptedQuests = character.acceptedQuests?.includes(quest.id)
        ? character.acceptedQuests
        : [...(character.acceptedQuests || []), quest.id];

    const updatedCharacter: Character = {
        ...character,
        acceptedQuests: newAcceptedQuests,
        activeQuestId: quest.id,
        questState: "active" as QuestState
    };

    // Update character in storage
    await updateCharacter(updatedCharacter);

    // Play quest accept sound
    audioManager.playSfx("questAccept");

    return { success: true, updatedCharacter };
}

export async function completeQuestAfterBattle(
    character: Character,
    activeQuest: Quest,
    success: boolean,
    xpReward: number,
    goldReward: number,
    rewardItem?: InventoryItem,
    rewardSkill?: string
): Promise<QuestLogicResult> {
    // Add quest to completedQuests if not already there
    const newCompletedQuests = character.completedQuests.includes(activeQuest.id)
        ? character.completedQuests
        : [...character.completedQuests, activeQuest.id];

    // Update character with rewards and clear active quest
    let updatedCharacter: Character = {
        ...character,
        xp: character.xp + xpReward,
        gold: character.gold + goldReward,
        completedQuests: newCompletedQuests,
        acceptedQuests: character.acceptedQuests?.filter(id => id !== activeQuest.id) || [],
        activeQuestId: undefined,
        questState: "list" as QuestState,
        ...(rewardItem && { inventory: [...character.inventory, rewardItem] }),
        ...(rewardSkill && !character.skills.includes(rewardSkill) && { skills: [...character.skills, rewardSkill] })
    };

    // Check for level up
    let leveledUp = false;
    if (updatedCharacter.xp >= updatedCharacter.xpToNext) {
        updatedCharacter.level += 1;
        updatedCharacter.xp -= updatedCharacter.xpToNext;
        updatedCharacter.xpToNext = Math.floor(updatedCharacter.xpToNext * 1.5);
        updatedCharacter.maxHp += 10;
        updatedCharacter.hp = updatedCharacter.maxHp;
        updatedCharacter.maxMp += 5;
        updatedCharacter.mp = updatedCharacter.maxMp;
        updatedCharacter.attack += 2;
        updatedCharacter.defense += 1;
        leveledUp = true;
    }

    // Check for region progression after quest completion
    let regionAdvanced = false;
    let newRegionName = "";
    if (success) {
        // Check if we should auto-advance to a new region
        if (shouldAutoAdvanceRegion(updatedCharacter)) {
            const nextRegions = getNextAvailableRegions(updatedCharacter);
            if (nextRegions.length > 0) {
                // Move to the first available next region
                const newRegion = nextRegions[0];
                updatedCharacter = {
                    ...updatedCharacter,
                    currentRegion: newRegion.id
                };
                regionAdvanced = true;
                newRegionName = newRegion.name;
            }
        }
    }

    // Update character in storage
    await updateCharacter(updatedCharacter);

    // Play appropriate sound
    if (success) {
        audioManager.playSfx("victory");
    } else {
        audioManager.playSfx("defeat");
    }

    if (leveledUp) {
        audioManager.playSfx("victory");
    }

    // Build success message
    let message = success ? `Quest Complete! +${xpReward} XP, +${goldReward} Gold` : "Quest Failed";
    if (regionAdvanced) {
        message += ` | New Region Unlocked: ${newRegionName}!`;
    }

    return {
        success,
        message,
        updatedCharacter,
        leveledUp,
        rewardItem,
        rewardSkill
    };
}


export async function handleBattleVictory(
    character: Character,
    activeQuest: Quest,
    selectedChoice: QuestChoice,
    battleXp: number,
    battleGold: number
): Promise<QuestLogicResult> {
    // Handle item reward
    let rewardedItem: InventoryItem | undefined;
    if (selectedChoice.rewardItemId) {
        const itemTemplate = ALL_ITEMS.find(i => i.id === selectedChoice.rewardItemId);
        if (itemTemplate) {
            rewardedItem = { ...itemTemplate, id: `${itemTemplate.id}-${Date.now()}` };
        }
    }

    // Use centralized quest completion function
    return completeQuestAfterBattle(
        character,
        activeQuest,
        true,
        battleXp + selectedChoice.xpReward,
        battleGold + selectedChoice.goldReward,
        rewardedItem,
        selectedChoice.rewardSkill
    );
}

export async function handleBattleDefeat(
    character: Character,
    activeQuest: Quest
): Promise<QuestLogicResult> {
    // Take HP damage on defeat - restore half HP
    const newHp = Math.max(1, Math.floor(character.maxHp / 2));

    const updatedCharacter: Character = {
        ...character,
        hp: newHp
    };

    // Use centralized quest completion function (failure)
    const result = await completeQuestAfterBattle(
        updatedCharacter,
        activeQuest,
        false,
        0,
        0
    );

    // Add redirect to shop flag for defeat
    return {
        ...result,
        redirectToShop: true
    };
}

export async function handleBattleFlee(
    character: Character
): Promise<{ success: boolean; updatedCharacter: Character }> {
    // Reset to quest list, don't complete the quest
    const updatedCharacter: Character = {
        ...character,
        questState: "list" as QuestState
    };

    return { success: true, updatedCharacter };
}

export async function resetQuest(
    character: Character
): Promise<{ success: boolean; updatedCharacter: Character }> {
    const updatedCharacter: Character = {
        ...character,
        activeQuestId: undefined,
        questState: "list" as QuestState
    };

    return { success: true, updatedCharacter };
}

export function getAvailableQuests(character: Character): Quest[] {
    return QUESTS.filter(q =>
        q.class === character.class &&
        !character.completedQuests.includes(q.id) &&
        character.acceptedQuests?.includes(q.id)
    );
}

export function getActiveQuest(character: Character): Quest | null {
    if (!character.activeQuestId) return null;
    return QUESTS.find(q => q.id === character.activeQuestId) || null;
}

// Re-export QUEST_ENEMIES for use in components
import { QUEST_ENEMIES } from "./game-data";