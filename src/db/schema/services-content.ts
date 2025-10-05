import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const servicesContent = pgTable("services_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  valueType: text("value_type", { enum: ["text", "image", "list"] })
    .notNull()
    .default("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
