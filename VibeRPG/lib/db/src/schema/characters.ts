import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const charactersTable = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class", { enum: ["mage", "warrior", "priest"] }).notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  hp: integer("hp").notNull(),
  maxHp: integer("max_hp").notNull(),
  mp: integer("mp").notNull(),
  maxMp: integer("max_mp").notNull(),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  magicPower: integer("magic_power").notNull(),
  gold: integer("gold").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(charactersTable).omit({ id: true, createdAt: true });
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof charactersTable.$inferSelect;
