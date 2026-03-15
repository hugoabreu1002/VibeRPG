import { Router } from "express";
import { db } from "@workspace/db";
import { questsTable, itemsTable } from "@workspace/db/schema";
import { SEED_QUESTS, SEED_ITEMS } from "../data/gameData.js";
import { sql } from "drizzle-orm";

const router = Router();

router.post("/seed", async (_req, res) => {
  // Seed quests if empty
  const existingQuests = await db.select().from(questsTable);
  if (existingQuests.length === 0) {
    await db.insert(questsTable).values(SEED_QUESTS);
  }

  // Seed items if empty
  const existingItems = await db.select().from(itemsTable);
  if (existingItems.length === 0) {
    await db.insert(itemsTable).values(SEED_ITEMS);
  }

  const quests = await db.select().from(questsTable);
  const items = await db.select().from(itemsTable);

  res.json({ quests: quests.length, items: items.length, message: "Seed complete" });
});

export default router;
