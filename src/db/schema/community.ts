import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const postStatus = [
  "pending",
  "approved",
  "rejected",
  "archived",
] as const;

export const communityGroups = pgTable("community_groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const communityGroupMemberships = pgTable(
  "community_group_memberships",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => communityGroups.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
  }
);

export const communityPosts = pgTable("community_posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: jsonb("content").notNull(),
  excerpt: text("excerpt"),
  images: text("images").array().default([]).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  groupId: text("group_id").references(() => communityGroups.id, {
    onDelete: "cascade",
  }),
  status: text("status")
    .$type<(typeof postStatus)[number]>()
    .default("pending")
    .notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => user.id),
  rejectionReason: text("rejection_reason"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const communityPostViews = pgTable("community_post_views", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id")
    .notNull()
    .references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityComments = pgTable("community_comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => communityPosts.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  isEdited: boolean("is_edited").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const communityLikes = pgTable("community_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id").references(() => communityPosts.id, {
    onDelete: "cascade",
  }),
  commentId: text("comment_id").references(() => communityComments.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityShares = pgTable("community_shares", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => communityPosts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportStatus = [
  "pending",
  "reviewed",
  "resolved",
  "dismissed",
] as const;

export const communityReports = pgTable("community_reports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id").references(() => communityPosts.id, {
    onDelete: "cascade",
  }),
  commentId: text("comment_id").references(() => communityComments.id, {
    onDelete: "cascade",
  }),
  reporterId: text("reporter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  description: text("description"),
  status: text("status")
    .$type<(typeof reportStatus)[number]>()
    .default("pending")
    .notNull(),
  reviewedBy: text("reviewed_by").references(() => user.id),
  reviewedAt: timestamp("reviewed_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
