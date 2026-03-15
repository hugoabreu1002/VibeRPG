import { Router } from "express";
import { db } from "@workspace/db";
import { questsTable, characterQuestsTable, charactersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { getXpToNextLevel } from "../data/gameData.js";
import { z } from "zod";

const router = Router();

router.get("/", async (_req, res) => {
  const quests = await db.select().from(questsTable);
  res.json(quests);
});

router.get("/character/:characterId", async (req, res) => {
  const characterId = parseInt(req.params.characterId);
  if (isNaN(characterId)) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  const rows = await db.select().from(characterQuestsTable)
    .where(eq(characterQuestsTable.characterId, characterId));

  const quests = await db.select().from(questsTable);
  const questMap = new Map(quests.map(q => [q.id, q]));

  const result = rows.map(r => ({
    ...r,
    completedAt: r.completedAt ? new Date(r.completedAt * 1000).toISOString() : null,
    quest: questMap.get(r.questId)!,
  }));

  res.json(result);
});

const characterIdBody = z.object({ characterId: z.number().int() });

router.post("/:questId/start", async (req, res) => {
  const questId = parseInt(req.params.questId);
  const parsed = characterIdBody.safeParse(req.body);
  if (!parsed.success || isNaN(questId)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { characterId } = parsed.data;

  const [quest] = await db.select().from(questsTable).where(eq(questsTable.id, questId));
  if (!quest) {
    res.status(404).json({ error: "Quest not found" });
    return;
  }

  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, characterId));
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  if (character.level < quest.requiredLevel) {
    res.status(400).json({ error: `Requires level ${quest.requiredLevel}` });
    return;
  }

  // Check if already active
  const [existing] = await db.select().from(characterQuestsTable)
    .where(and(eq(characterQuestsTable.characterId, characterId), eq(characterQuestsTable.questId, questId)));

  if (existing) {
    res.status(400).json({ error: "Quest already active or completed" });
    return;
  }

  const [charQuest] = await db.insert(characterQuestsTable).values({
    characterId,
    questId,
    status: "active",
  }).returning();

  res.json({ ...charQuest, completedAt: null, quest });
});

router.post("/:questId/complete", async (req, res) => {
  const questId = parseInt(req.params.questId);
  const parsed = characterIdBody.safeParse(req.body);
  if (!parsed.success || isNaN(questId)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { characterId } = parsed.data;

  const [charQuest] = await db.select().from(characterQuestsTable)
    .where(and(eq(characterQuestsTable.characterId, characterId), eq(characterQuestsTable.questId, questId)));

  if (!charQuest) {
    res.status(404).json({ error: "Quest not started" });
    return;
  }
  if (charQuest.status === "completed") {
    res.status(400).json({ error: "Quest already completed" });
    return;
  }

  const [quest] = await db.select().from(questsTable).where(eq(questsTable.id, questId));
  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, characterId));
  if (!quest || !character) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const [updatedCharQuest] = await db.update(characterQuestsTable)
    .set({ status: "completed", completedAt: now })
    .where(eq(characterQuestsTable.id, charQuest.id))
    .returning();

  // Grant XP and gold
  const newXp = character.xp + quest.xpReward;
  const newGold = character.gold + quest.goldReward;
  let newLevel = character.level;
  let newHp = character.hp;
  let newMp = character.mp;
  let newMaxHp = character.maxHp;
  let newMaxMp = character.maxMp;
  let newAttack = character.attack;
  let newDefense = character.defense;
  let newMagicPower = character.magicPower;
  let leveledUp = false;
  let xpRequired = getXpToNextLevel(newLevel);

  while (newXp >= xpRequired) {
    newLevel++;
    leveledUp = true;
    // Level up bonuses
    const classType = character.class;
    if (classType === "mage") {
      newMaxHp += 5;
      newMaxMp += 15;
      newAttack += 1;
      newDefense += 1;
      newMagicPower += 4;
    } else if (classType === "warrior") {
      newMaxHp += 15;
      newMaxMp += 3;
      newAttack += 4;
      newDefense += 3;
      newMagicPower += 1;
    } else if (classType === "priest") {
      newMaxHp += 10;
      newMaxMp += 8;
      newAttack += 2;
      newDefense += 2;
      newMagicPower += 3;
    }
    newHp = newMaxHp;
    newMp = newMaxMp;
    xpRequired = getXpToNextLevel(newLevel);
  }

  const [updatedCharacter] = await db.update(charactersTable)
    .set({
      xp: newXp,
      gold: newGold,
      level: newLevel,
      hp: newHp,
      mp: newMp,
      maxHp: newMaxHp,
      maxMp: newMaxMp,
      attack: newAttack,
      defense: newDefense,
      magicPower: newMagicPower,
    })
    .where(eq(charactersTable.id, characterId))
    .returning();

  const xpToNext = getXpToNextLevel(updatedCharacter.level);

  res.json({
    characterQuest: { ...updatedCharQuest, completedAt: updatedCharQuest.completedAt ? new Date(updatedCharQuest.completedAt * 1000).toISOString() : null, quest },
    character: { ...updatedCharacter, xpToNext },
    leveledUp,
    xpGained: quest.xpReward,
    goldGained: quest.goldReward,
  });
});

export default router;
