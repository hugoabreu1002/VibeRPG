import { pgTable, serial, integer, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const battlesTable = pgTable("battles", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  characterHp: integer("character_hp").notNull(),
  characterMp: integer("character_mp").notNull(),
  enemyName: text("enemy_name").notNull(),
  enemyHp: integer("enemy_hp").notNull(),
  enemyMaxHp: integer("enemy_max_hp").notNull(),
  enemyAttack: integer("enemy_attack").notNull(),
  enemyDefense: integer("enemy_defense").notNull(),
  status: text("status", { enum: ["ongoing", "victory", "defeat"] }).notNull().default("ongoing"),
  round: integer("round").notNull().default(1),
  logs: jsonb("logs").notNull().default([]),
  xpReward: integer("xp_reward"),
  goldReward: integer("gold_reward"),
});

export const insertBattleSchema = createInsertSchema(battlesTable).omit({ id: true });
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type BattleRow = typeof battlesTable.$inferSelect;
