import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const mediaHighlights = pgTable("media_highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // featured, podcast, award, social, testimonial, feature
  title: text("title").notNull(),
  description: text("description").notNull(),
  quote: text("quote").notNull(),
  image: text("image").notNull(),
  color: text("color").notNull().default("primary"), // primary, secondary
  date: text("date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MediaHighlight = typeof mediaHighlights.$inferSelect;
export type NewMediaHighlight = typeof mediaHighlights.$inferInsert;
