import { Router } from "express";
import { db } from "@workspace/db";
import { battlesTable, charactersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { ENEMIES, SPELLS, scaleEnemy, getXpToNextLevel } from "../data/gameData.js";
import { z } from "zod";

const router = Router();

type BattleLog = {
  round: number;
  actor: string;
  action: string;
  damage: number | null;
  heal: number | null;
  message: string;
};

function formatBattle(battle: typeof battlesTable.$inferSelect) {
  const logs = (battle.logs as BattleLog[]) || [];
  const enemyTemplate = ENEMIES[battle.enemyName];
  return {
    id: battle.id,
    characterId: battle.characterId,
    characterHp: battle.characterHp,
    characterMp: battle.characterMp,
    enemy: {
      name: battle.enemyName,
      hp: battle.enemyHp,
      maxHp: battle.enemyMaxHp,
      attack: battle.enemyAttack,
      defense: battle.enemyDefense,
      description: enemyTemplate?.description || "",
      type: enemyTemplate?.type || "Unknown",
    },
    status: battle.status,
    round: battle.round,
    logs,
    xpReward: battle.xpReward ?? null,
    goldReward: battle.goldReward ?? null,
  };
}

router.post("/", async (req, res) => {
  const body = z.object({ characterId: z.number().int(), enemyName: z.string() }).safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { characterId, enemyName } = body.data;
  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, characterId));
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  const template = ENEMIES[enemyName];
  if (!template) {
    res.status(400).json({ error: `Unknown enemy: ${enemyName}` });
    return;
  }

  const scaled = scaleEnemy(template, character.level);

  const initLog: BattleLog = {
    round: 1,
    actor: "system",
    action: "start",
    damage: null,
    heal: null,
    message: `A ${scaled.name} appears! (${scaled.description})`,
  };

  const [battle] = await db.insert(battlesTable).values({
    characterId,
    characterHp: character.hp,
    characterMp: character.mp,
    enemyName: scaled.name,
    enemyHp: scaled.hp,
    enemyMaxHp: scaled.maxHp,
    enemyAttack: scaled.attack,
    enemyDefense: scaled.defense,
    status: "ongoing",
    round: 1,
    logs: [initLog],
    xpReward: scaled.xpReward,
    goldReward: scaled.goldReward,
  }).returning();

  res.status(201).json(formatBattle(battle));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid battle id" });
    return;
  }
  const [battle] = await db.select().from(battlesTable).where(eq(battlesTable.id, id));
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  res.json(formatBattle(battle));
});

router.post("/:id/action", async (req, res) => {
  const battleId = parseInt(req.params.id);
  const body = z.object({
    action: z.enum(["attack", "spell", "defend", "item", "flee"]),
    spellName: z.string().nullable().optional(),
  }).safeParse(req.body);

  if (!body.success || isNaN(battleId)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [battle] = await db.select().from(battlesTable).where(eq(battlesTable.id, battleId));
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  if (battle.status !== "ongoing") {
    res.status(400).json({ error: "Battle is already over" });
    return;
  }

  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, battle.characterId));
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  const { action, spellName } = body.data;
  const existingLogs = (battle.logs as BattleLog[]) || [];
  const newLogs: BattleLog[] = [];
  let characterHp = battle.characterHp;
  let characterMp = battle.characterMp;
  let enemyHp = battle.enemyHp;
  let round = battle.round;
  let isDefending = false;

  // Player action
  if (action === "attack") {
    const baseDamage = Math.max(1, character.attack - battle.enemyDefense + Math.floor(Math.random() * 6));
    enemyHp = Math.max(0, enemyHp - baseDamage);
    newLogs.push({
      round,
      actor: "player",
      action: "attack",
      damage: baseDamage,
      heal: null,
      message: `${character.name} attacks for ${baseDamage} damage!`,
    });
  } else if (action === "spell" && spellName) {
    const spell = SPELLS[spellName];
    if (!spell || !spell.classes.includes(character.class)) {
      res.status(400).json({ error: "Invalid spell" });
      return;
    }
    if (characterMp < spell.mpCost) {
      res.status(400).json({ error: "Not enough MP" });
      return;
    }
    characterMp = Math.max(0, characterMp - spell.mpCost);

    if (spell.healAmount) {
      const healed = Math.min(character.maxHp - characterHp, spell.healAmount);
      characterHp = Math.min(character.maxHp, characterHp + healed);
      newLogs.push({
        round,
        actor: "player",
        action: "spell",
        damage: null,
        heal: healed,
        message: `${character.name} casts ${spellName}! Restores ${healed} HP.`,
      });
    } else if (spell.damageMultiplier > 0) {
      const magicDamage = Math.max(1, Math.floor(character.magicPower * spell.damageMultiplier) - Math.floor(battle.enemyDefense / 2) + Math.floor(Math.random() * 8));
      enemyHp = Math.max(0, enemyHp - magicDamage);
      newLogs.push({
        round,
        actor: "player",
        action: "spell",
        damage: magicDamage,
        heal: null,
        message: `${character.name} casts ${spellName} for ${magicDamage} magic damage!`,
      });
    }
  } else if (action === "defend") {
    isDefending = true;
    newLogs.push({
      round,
      actor: "player",
      action: "defend",
      damage: null,
      heal: null,
      message: `${character.name} takes a defensive stance!`,
    });
  } else if (action === "flee") {
    newLogs.push({
      round,
      actor: "player",
      action: "flee",
      damage: null,
      heal: null,
      message: `${character.name} flees from battle!`,
    });
    const [updatedBattle] = await db.update(battlesTable)
      .set({ status: "defeat", logs: [...existingLogs, ...newLogs], characterHp, characterMp, enemyHp })
      .where(eq(battlesTable.id, battleId))
      .returning();
    return res.json({
      battle: formatBattle(updatedBattle),
      character: { ...character, xpToNext: getXpToNextLevel(character.level) },
      newLogs,
      leveledUp: false,
    });
  }

  // Check if enemy is defeated
  if (enemyHp <= 0) {
    // Victory
    const xpGained = battle.xpReward || 0;
    const goldGained = battle.goldReward || 0;
    newLogs.push({
      round,
      actor: "system",
      action: "victory",
      damage: null,
      heal: null,
      message: `${battle.enemyName} is defeated! Gained ${xpGained} XP and ${goldGained} gold.`,
    });

    const [updatedBattle] = await db.update(battlesTable)
      .set({ status: "victory", logs: [...existingLogs, ...newLogs], enemyHp: 0, characterHp, characterMp })
      .where(eq(battlesTable.id, battleId))
      .returning();

    // Give XP and gold
    let newXp = character.xp + xpGained;
    let newGold = character.gold + goldGained;
    let newLevel = character.level;
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
      const classType = character.class;
      if (classType === "mage") {
        newMaxHp += 5; newMaxMp += 15; newAttack += 1; newDefense += 1; newMagicPower += 4;
      } else if (classType === "warrior") {
        newMaxHp += 15; newMaxMp += 3; newAttack += 4; newDefense += 3; newMagicPower += 1;
      } else if (classType === "priest") {
        newMaxHp += 10; newMaxMp += 8; newAttack += 2; newDefense += 2; newMagicPower += 3;
      }
      xpRequired = getXpToNextLevel(newLevel);
    }

    const [updatedCharacter] = await db.update(charactersTable)
      .set({ xp: newXp, gold: newGold, level: newLevel, hp: characterHp, mp: characterMp, maxHp: newMaxHp, maxMp: newMaxMp, attack: newAttack, defense: newDefense, magicPower: newMagicPower })
      .where(eq(charactersTable.id, character.id))
      .returning();

    return res.json({
      battle: formatBattle(updatedBattle),
      character: { ...updatedCharacter, xpToNext: getXpToNextLevel(updatedCharacter.level) },
      newLogs,
      leveledUp,
    });
  }

  // Enemy turn
  const defenseMultiplier = isDefending ? 0.4 : 1.0;
  const rawEnemyDamage = Math.max(1, battle.enemyAttack - character.defense + Math.floor(Math.random() * 6));
  const enemyDamage = Math.floor(rawEnemyDamage * defenseMultiplier);
  characterHp = Math.max(0, characterHp - enemyDamage);
  newLogs.push({
    round,
    actor: "enemy",
    action: "attack",
    damage: enemyDamage,
    heal: null,
    message: isDefending
      ? `${battle.enemyName} attacks but ${character.name}'s defense absorbs most of it! (${enemyDamage} damage)`
      : `${battle.enemyName} attacks ${character.name} for ${enemyDamage} damage!`,
  });

  round++;

  // Check player defeat
  let status: "ongoing" | "victory" | "defeat" = "ongoing";
  if (characterHp <= 0) {
    status = "defeat";
    newLogs.push({
      round,
      actor: "system",
      action: "defeat",
      damage: null,
      heal: null,
      message: `${character.name} has been defeated...`,
    });
  }

  const [updatedBattle] = await db.update(battlesTable)
    .set({ characterHp, characterMp, enemyHp, round, status, logs: [...existingLogs, ...newLogs] })
    .where(eq(battlesTable.id, battleId))
    .returning();

  // Sync character HP/MP
  await db.update(charactersTable)
    .set({ hp: characterHp, mp: characterMp })
    .where(eq(charactersTable.id, character.id));

  return res.json({
    battle: formatBattle(updatedBattle),
    character: { ...character, hp: characterHp, mp: characterMp, xpToNext: getXpToNextLevel(character.level) },
    newLogs,
    leveledUp: false,
  });
});

export default router;
