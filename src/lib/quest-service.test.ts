import { questService } from "./quest-service";
import type { Character, Quest } from "../types/game";
import { QUESTS } from "./game-data";

// Mock character for testing
const createTestCharacter = (level: number = 1, characterClass: string = "mage"): Character => ({
  id: 1,
  createdAt: Date.now(),
  name: "Test Character",
  class: characterClass as any,
  level,
  xp: 0,
  gold: 100,
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  attack: 10,
  defense: 10,
  magicPower: 20,
  xpToNext: 100,
  rank: "F",
  skills: ["bolt", "defend"],
  inventory: [],
  completedQuests: [],
  currentRegion: "Hub Town",
  activeQuestId: null,
  questState: "list"
});

describe("Quest Service Tests", () => {
  test("should get available quests for character", async () => {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    console.log("Available quests for level 1 mage:", availableQuests.map(q => q.title));
    
    // Should have at least some quests available
    expect(availableQuests.length).toBeGreaterThan(0);
    
    // All quests should be for mage class
    availableQuests.forEach(quest => {
      expect(quest.class).toBe("mage");
    });
  });

  test("should filter quests by level requirement", async () => {
    const lowLevelCharacter = createTestCharacter(1, "mage");
    const highLevelCharacter = createTestCharacter(10, "mage");
    
    const lowLevelQuests = questService.getAvailableQuests(lowLevelCharacter);
    const highLevelQuests = questService.getAvailableQuests(highLevelCharacter);
    
    console.log("Low level quests:", lowLevelQuests.length);
    console.log("High level quests:", highLevelQuests.length);
    
    // High level character should have more quests available
    expect(highLevelQuests.length).toBeGreaterThanOrEqual(lowLevelQuests.length);
  });

  test("should calculate region progress correctly", async () => {
    const character = createTestCharacter(1, "mage");
    const progress = questService.getRegionProgress(character);
    
    console.log("Region progress:", progress);
    
    expect(progress.current).toBe(0);
    expect(progress.total).toBeGreaterThanOrEqual(0);
    expect(progress.percentage).toBe(0);
  });

  test("should calculate quest progress correctly", async () => {
    const character = createTestCharacter(1, "mage");
    const progress = questService.getQuestProgress(character);
    
    console.log("Quest progress:", progress);
    
    expect(progress.current).toBe(0);
    expect(progress.total).toBeGreaterThanOrEqual(0);
    expect(progress.percentage).toBe(0);
  });

  test("should start a quest successfully", async () => {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length > 0) {
      const quest = availableQuests[0];
      const result = await questService.startQuest(character, quest.id);
      
      console.log("Start quest result:", result);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe("Quest started");
      expect(result.quest).toBeDefined();
    }
  });

  test("should attempt quest choice and get result", async () => {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length > 0) {
      const quest = availableQuests[0];
      const choice = quest.choices[0];
      
      const result = await questService.attemptQuestChoice(character, choice);
      
      console.log("Quest choice result:", result);
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.message).toBeDefined();
    }
  });

  test("should handle completed quests correctly", async () => {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length > 0) {
      const quest = availableQuests[0];
      
      // Start the quest
      await questService.startQuest(character, quest.id);
      
      // Attempt a choice
      const choice = quest.choices[0];
      const choiceResult = await questService.attemptQuestChoice(character, choice);
      
      console.log("Quest completion test - choice result:", choiceResult);
      
      // Check if we can start the quest again (should fail)
      const duplicateResult = await questService.startQuest(character, quest.id);
      expect(duplicateResult.success).toBe(false);
      expect(duplicateResult.message).toBe("Cannot accept this quest");
    }
  });

  test("should get available regions correctly", async () => {
    const character = createTestCharacter(1, "mage");
    const regions = questService.getAvailableRegions(character);
    
    console.log("Available regions:", regions);
    
    // Should always have Hub Town
    expect(regions).toContain("Hub Town");
  });
});

// Run the tests
console.log("Running Quest Service Tests...");
const tests = new QuestServiceTests();
tests.runTests();

class QuestServiceTests {
  async runTests() {
    try {
      await this.testAvailableQuests();
      await this.testLevelFiltering();
      await this.testProgressCalculation();
      await this.testQuestStart();
      await this.testQuestChoice();
      await this.testCompletedQuests();
      await this.testAvailableRegions();
      
      console.log("✅ All tests passed!");
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  }

  async testAvailableQuests() {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    console.log("Available quests for level 1 mage:", availableQuests.map(q => q.title));
    
    if (availableQuests.length === 0) {
      throw new Error("No quests available for test character");
    }
    
    availableQuests.forEach(quest => {
      if (quest.class !== "mage") {
        throw new Error(`Quest ${quest.title} is not for mage class`);
      }
    });
  }

  async testLevelFiltering() {
    const lowLevelCharacter = createTestCharacter(1, "mage");
    const highLevelCharacter = createTestCharacter(10, "mage");
    
    const lowLevelQuests = questService.getAvailableQuests(lowLevelCharacter);
    const highLevelQuests = questService.getAvailableQuests(highLevelCharacter);
    
    console.log("Low level quests:", lowLevelQuests.length);
    console.log("High level quests:", highLevelQuests.length);
    
    if (highLevelQuests.length < lowLevelQuests.length) {
      throw new Error("High level character should have more or equal quests available");
    }
  }

  async testProgressCalculation() {
    const character = createTestCharacter(1, "mage");
    const regionProgress = questService.getRegionProgress(character);
    const questProgress = questService.getQuestProgress(character);
    
    console.log("Region progress:", regionProgress);
    console.log("Quest progress:", questProgress);
    
    if (regionProgress.current !== 0) {
      throw new Error("Region progress should start at 0");
    }
    
    if (questProgress.current !== 0) {
      throw new Error("Quest progress should start at 0");
    }
  }

  async testQuestStart() {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length === 0) {
      console.log("No quests available to test starting");
      return;
    }
    
    const quest = availableQuests[0];
    const result = await questService.startQuest(character, quest.id);
    
    console.log("Start quest result:", result);
    
    if (!result.success) {
      throw new Error(`Failed to start quest: ${result.message}`);
    }
    
    if (!result.quest) {
      throw new Error("Quest should be returned when starting successfully");
    }
  }

  async testQuestChoice() {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length === 0) {
      console.log("No quests available to test choice");
      return;
    }
    
    const quest = availableQuests[0];
    const choice = quest.choices[0];
    
    const result = await questService.attemptQuestChoice(character, choice);
    
    console.log("Quest choice result:", result);
    
    if (!result.result) {
      throw new Error("Choice result should be defined");
    }
    
    if (!result.result.message) {
      throw new Error("Choice result should have a message");
    }
  }

  async testCompletedQuests() {
    const character = createTestCharacter(1, "mage");
    const availableQuests = questService.getAvailableQuests(character);
    
    if (availableQuests.length === 0) {
      console.log("No quests available to test completion");
      return;
    }
    
    const quest = availableQuests[0];
    
    // Start the quest
    const startResult = await questService.startQuest(character, quest.id);
    if (!startResult.success) {
      throw new Error(`Failed to start quest: ${startResult.message}`);
    }
    
    // Attempt a choice
    const choice = quest.choices[0];
    const choiceResult = await questService.attemptQuestChoice(character, choice);
    
    console.log("Quest completion test - choice result:", choiceResult);
    
    // Check if we can start the quest again (should fail)
    const duplicateResult = await questService.startQuest(character, quest.id);
    if (duplicateResult.success) {
      throw new Error("Should not be able to start the same quest twice");
    }
  }

  async testAvailableRegions() {
    const character = createTestCharacter(1, "mage");
    const regions = questService.getAvailableRegions(character);
    
    console.log("Available regions:", regions);
    
    if (!regions.includes("Hub Town")) {
      throw new Error("Hub Town should always be available");
    }
  }
}