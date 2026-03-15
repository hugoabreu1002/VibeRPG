import { Router } from "express";
import { db } from "@workspace/db";
import { itemsTable, inventoryTable, charactersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await db.select().from(itemsTable);
  res.json(items);
});

router.post("/buy", async (req, res) => {
  const body = z.object({ characterId: z.number().int(), itemId: z.number().int() }).safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { characterId, itemId } = body.data;

  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, characterId));
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, itemId));
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  if (character.gold < item.cost) {
    res.status(400).json({ error: "Not enough gold" });
    return;
  }

  const [updatedCharacter] = await db.update(charactersTable)
    .set({ gold: character.gold - item.cost })
    .where(eq(charactersTable.id, characterId))
    .returning();

  const [invItem] = await db.insert(inventoryTable).values({
    characterId,
    itemId,
    equipped: false,
  }).returning();

  const xpToNext = Math.floor(100 * Math.pow(1.5, updatedCharacter.level - 1));

  res.json({
    inventoryItem: { id: invItem.id, characterId: invItem.characterId, equipped: invItem.equipped, item },
    character: { ...updatedCharacter, xpToNext },
  });
});

export default router;
