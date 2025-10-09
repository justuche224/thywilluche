import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ngoContent = pgTable("ngo_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  valueType: text("value_type").notNull().default("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type NgoContent = typeof ngoContent.$inferSelect;
export type NewNgoContent = typeof ngoContent.$inferInsert;
