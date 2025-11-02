import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const blogCategories = [
  "Poetry",
  "Essays",
  "Reflections",
  "Thought Leadership",
  "Play & Win",
  "Healing & Personal Growth",
  "Love, Sex & Relationships",
  "Fashion & Identity",
  "Lifestyle & Culture",
  "Creativity & Storytelling",
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

export const blogComments = pgTable("blog_comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  isEdited: boolean("is_edited").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const blogLikes = pgTable("blog_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id").references(() => blogPosts.id, {
    onDelete: "cascade",
  }),
  commentId: text("comment_id").references(() => blogComments.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogShares = pgTable("blog_shares", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});
