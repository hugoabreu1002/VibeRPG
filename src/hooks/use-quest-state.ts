import { useState, useCallback, useEffect } from "react";
import type { Character, Quest, QuestChoice, QuestResult, QuestState } from "../types/game";
import { questService } from "../lib/quest-service";
import { updateCharacter } from "../lib/storage";

export interface UseQuestStateReturn {
  // State
  character: Character;
  availableQuests: Quest[];
  activeQuest: Quest | null;
  questResult: QuestResult | null;
  questState: QuestState;

  // Actions
  startQuest: (quest: Quest) => Promise<void>;
  attemptChoice: (choice: QuestChoice) => Promise<void>;
  completeQuest: (result: QuestResult) => Promise<void>;
  resetQuest: () => Promise<void>;
  updateCharacterState: (updates: Partial<Character>) => Promise<void>;

  // Progress
  regionProgress: { current: number; total: number; percentage: number };
  questProgress: { current: number; total: number; percentage: number };
}

export function useQuestState(initialCharacter: Character): UseQuestStateReturn {
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [questResult, setQuestResult] = useState<QuestResult | null>(null);
  const [regionProgress, setRegionProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [questProgress, setQuestProgress] = useState({ current: 0, total: 0, percentage: 0 });

  // Update progress when character changes
  useEffect(() => {
    const regionProg = questService.getRegionProgress(character);
    const questProg = questService.getQuestProgress(character);
    setRegionProgress(regionProg);
    setQuestProgress(questProg);
  }, [character]);

  const updateCharacterState = useCallback(async (updates: Partial<Character>) => {
    const updatedCharacter = { ...character, ...updates };
    const savedCharacter = await updateCharacter(updatedCharacter);
    setCharacter(savedCharacter);
  }, [character]);

  const startQuest = useCallback(async (quest: Quest) => {
    try {
      const result = await questService.startQuest(character, quest.id);
      if (result.success) {
        // Update character state - include acceptedQuests to show quest in log
        const updatedCharacter = {
          ...character,
          activeQuestId: quest.id,
          questState: "map" as QuestState,
          acceptedQuests: [...(character.acceptedQuests || []), quest.id]
        };
        const savedCharacter = await updateCharacter(updatedCharacter);
        setCharacter(savedCharacter);
      } else {
        console.error("Failed to start quest:", result.message);
      }
    } catch (error) {
      console.error("Error starting quest:", error);
    }
  }, [character]);

  const attemptChoice = useCallback(async (choice: QuestChoice) => {
    try {
      const result = await questService.attemptQuestChoice(character, choice);

      // Update character state to battle phase
      const updatedCharacter = {
        ...character,
        questState: "battle" as QuestState
      };
      const savedCharacter = await updateCharacter(updatedCharacter);
      setCharacter(savedCharacter);

      // Store the battle result for later completion
      setQuestResult(result.result);
    } catch (error) {
      console.error("Error attempting quest choice:", error);
    }
  }, [character]);

  const completeQuest = useCallback(async (result: QuestResult) => {
    try {
      const updatedCharacter = await questService.completeQuest(character, result);
      setCharacter(updatedCharacter);
      setQuestResult(null);
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  }, [character]);

  const resetQuest = useCallback(async () => {
    try {
      const updatedCharacter = await questService.resetQuest(character);
      setCharacter(updatedCharacter);
      setQuestResult(null);
    } catch (error) {
      console.error("Error resetting quest:", error);
    }
  }, [character]);

  // Get available quests
  const availableQuests = questService.getAvailableQuests(character);

  // Get active quest
  const activeQuest = questService.getActiveQuest(character);

  // Get current quest state
  const questState = character.questState || "list";

  return {
    character,
    availableQuests,
    activeQuest,
    questResult,
    questState,
    startQuest,
    attemptChoice,
    completeQuest,
    resetQuest,
    updateCharacterState,
    regionProgress,
    questProgress
  };
}