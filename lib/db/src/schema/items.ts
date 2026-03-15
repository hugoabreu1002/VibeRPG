import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const itemsTable = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["weapon", "armor", "accessory", "consumable"] }).notNull(),
  attackBonus: integer("attack_bonus").notNull().default(0),
  defenseBonus: integer("defense_bonus").notNull().default(0),
  hpBonus: integer("hp_bonus").notNull().default(0),
  mpBonus: integer("mp_bonus").notNull().default(0),
  magicPowerBonus: integer("magic_power_bonus").notNull().default(0),
  cost: integer("cost").notNull(),
  classRestriction: text("class_restriction"),
});

export const insertItemSchema = createInsertSchema(itemsTable).omit({ id: true });
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof itemsTable.$inferSelect;
