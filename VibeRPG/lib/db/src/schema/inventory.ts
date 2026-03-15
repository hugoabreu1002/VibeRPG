import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inventoryTable = pgTable("inventory", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  itemId: integer("item_id").notNull(),
  equipped: boolean("equipped").notNull().default(false),
});

export const insertInventorySchema = createInsertSchema(inventoryTable).omit({ id: true });
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InventoryRow = typeof inventoryTable.$inferSelect;
