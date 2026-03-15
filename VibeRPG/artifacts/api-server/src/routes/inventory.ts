import { Router } from "express";
import { db } from "@workspace/db";
import { inventoryTable, itemsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

async function getInventoryWithItems(characterId: number) {
  const rows = await db.select().from(inventoryTable).where(eq(inventoryTable.characterId, characterId));
  const items = await db.select().from(itemsTable);
  const itemMap = new Map(items.map(i => [i.id, i]));
  return rows.map(r => ({
    id: r.id,
    characterId: r.characterId,
    equipped: r.equipped,
    item: itemMap.get(r.itemId)!,
  }));
}

router.get("/:characterId", async (req, res) => {
  const characterId = parseInt(req.params.characterId);
  if (isNaN(characterId)) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }
  const inventory = await getInventoryWithItems(characterId);
  res.json(inventory);
});

router.post("/:characterId/equip", async (req, res) => {
  const characterId = parseInt(req.params.characterId);
  const body = z.object({ inventoryItemId: z.number().int(), equip: z.boolean() }).safeParse(req.body);
  if (!body.success || isNaN(characterId)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { inventoryItemId, equip } = body.data;

  const [invItem] = await db.select().from(inventoryTable)
    .where(and(eq(inventoryTable.id, inventoryItemId), eq(inventoryTable.characterId, characterId)));

  if (!invItem) {
    res.status(404).json({ error: "Item not found in inventory" });
    return;
  }

  const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, invItem.itemId));

  // If equipping, unequip other items of same type
  if (equip && item) {
    const sameTypeItems = await db.select().from(inventoryTable).where(eq(inventoryTable.characterId, characterId));
    for (const existing of sameTypeItems) {
      const existingItem = await db.select().from(itemsTable).where(eq(itemsTable.id, existing.itemId));
      if (existingItem[0]?.type === item.type && existing.equipped && existing.id !== inventoryItemId) {
        await db.update(inventoryTable).set({ equipped: false }).where(eq(inventoryTable.id, existing.id));
      }
    }
  }

  const [updated] = await db.update(inventoryTable)
    .set({ equipped: equip })
    .where(eq(inventoryTable.id, inventoryItemId))
    .returning();

  res.json({ id: updated.id, characterId: updated.characterId, equipped: updated.equipped, item });
});

export default router;
