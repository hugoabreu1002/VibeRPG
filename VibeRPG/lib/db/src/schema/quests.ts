import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questsTable = pgTable("quests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  lore: text("lore").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard", "legendary"] }).notNull(),
  xpReward: integer("xp_reward").notNull(),
  goldReward: integer("gold_reward").notNull(),
  enemyName: text("enemy_name").notNull(),
  region: text("region").notNull(),
  requiredLevel: integer("required_level").notNull().default(1),
});

export const characterQuestsTable = pgTable("character_quests", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  questId: integer("quest_id").notNull(),
  status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
  completedAt: integer("completed_at"),
});

export const insertQuestSchema = createInsertSchema(questsTable).omit({ id: true });
export const insertCharacterQuestSchema = createInsertSchema(characterQuestsTable).omit({ id: true });
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof questsTable.$inferSelect;
export type CharacterQuestRow = typeof characterQuestsTable.$inferSelect;
