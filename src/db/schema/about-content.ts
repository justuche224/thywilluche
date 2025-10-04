import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const aboutContent = pgTable("about_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  valueType: text("value_type").notNull().default("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AboutContent = typeof aboutContent.$inferSelect;
export type NewAboutContent = typeof aboutContent.$inferInsert;
