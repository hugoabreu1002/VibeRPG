import { Router } from "express";
import { db } from "@workspace/db";
import { charactersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { getStartingStats } from "../data/gameData.js";
import { z } from "zod";

const router = Router();

const createCharacterBody = z.object({
  name: z.string().min(1).max(30),
  class: z.enum(["mage", "warrior", "priest"]),
});

router.post("/", async (req, res) => {
  const parsed = createCharacterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, class: characterClass } = parsed.data;
  const stats = getStartingStats(characterClass);

  const [character] = await db.insert(charactersTable).values({
    name,
    class: characterClass,
    level: 1,
    xp: 0,
    ...stats,
    gold: 100,
  }).returning();

  const xpToNext = Math.floor(100 * Math.pow(1.5, 0));
  res.status(201).json({ ...character, xpToNext });
});

router.get("/current", async (_req, res) => {
  const [character] = await db.select().from(charactersTable).orderBy(desc(charactersTable.createdAt)).limit(1);
  if (!character) {
    res.status(404).json({ error: "No character found" });
    return;
  }
  const xpToNext = Math.floor(100 * Math.pow(1.5, character.level - 1));
  res.json({ ...character, xpToNext });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  const [character] = await db.select().from(charactersTable).where(eq(charactersTable.id, id));
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }
  const xpToNext = Math.floor(100 * Math.pow(1.5, character.level - 1));
  res.json({ ...character, xpToNext });
});

export default router;
