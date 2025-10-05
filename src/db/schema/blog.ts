import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blogCategories = [
  "Poetry",
  "Essays",
  "Reflections",
  "Thought Leadership",
  "Winners of Game",
] as const;

export const blogStatus = ["draft", "published", "archived"] as const;

export const blogPosts = pgTable("blog_posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  category: text("category").$type<(typeof blogCategories)[number]>().notNull(),
  tags: text("tags").array().default([]).notNull(),
  imageUrl: text("image_url"),
  content: jsonb("content").notNull(),
  status: text("status")
    .$type<(typeof blogStatus)[number]>()
    .default("draft")
    .notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
