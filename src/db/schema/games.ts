import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const gameTypes = ["quiz", "writing_challenge", "puzzle"] as const;
export const gameStatus = ["draft", "published", "archived"] as const;
export const difficultyLevels = ["easy", "medium", "hard"] as const;
export const questionTypes = [
  "multiple_choice",
  "true_false",
  "short_answer",
] as const;
export const rewardTypes = [
  "badge",
  "points",
  "discount_code",
  "book_credit",
] as const;
export const badgeTypes = [
  "game_winner",
  "participation",
  "streak",
  "milestone",
] as const;
export const badgeRarity = ["common", "rare", "epic", "legendary"] as const;
export const pointSources = [
  "game_win",
  "participation",
  "share",
  "admin_award",
] as const;

export const games = pgTable("games", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").$type<(typeof gameTypes)[number]>().notNull(),
  difficulty: text("difficulty")
    .$type<(typeof difficultyLevels)[number]>()
    .default("medium")
    .notNull(),
  instructions: text("instructions"),
  status: text("status")
    .$type<(typeof gameStatus)[number]>()
    .default("draft")
    .notNull(),
  config: jsonb("config").$type<{
    timeLimit?: number;
    wordLimit?: number;
    maxAttempts?: number;
    allowLateSubmissions?: boolean;
    judgingCriteria?: string;
    hints?: string[];
    [key: string]: unknown;
  }>(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const gameQuestions = pgTable("game_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  type: text("type").$type<(typeof questionTypes)[number]>().notNull(),
  options: jsonb("options").$type<string[]>().default([]),
  correctAnswer: jsonb("correct_answer").$type<string | string[]>().notNull(),
  points: integer("points").default(1).notNull(),
  order: integer("order").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameSubmissions = pgTable("game_submissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  answers: jsonb("answers")
    .$type<{
      questionId?: string;
      answer?: string | string[];
      text?: string;
      [key: string]: unknown;
    }>()
    .notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  score: integer("score").default(0),
  isWinner: boolean("is_winner").default(false).notNull(),
  reviewedBy: text("reviewed_by").references(() => user.id),
  reviewedAt: timestamp("reviewed_at"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const badges = pgTable("badges", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: text("type").$type<(typeof badgeTypes)[number]>().notNull(),
  criteria: jsonb("criteria").$type<{
    automatic?: boolean;
    requiredPoints?: number;
    requiredWins?: number;
    requiredParticipation?: number;
    gameType?: string;
    [key: string]: unknown;
  }>(),
  rarity: text("rarity")
    .$type<(typeof badgeRarity)[number]>()
    .default("common")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  badgeId: text("badge_id")
    .notNull()
    .references(() => badges.id, { onDelete: "cascade" }),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  displayOnProfile: boolean("display_on_profile").default(true).notNull(),
});

export const userPoints = pgTable("user_points", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  source: text("source").$type<(typeof pointSources)[number]>().notNull(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameRewards = pgTable("game_rewards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  rewardType: text("reward_type")
    .$type<(typeof rewardTypes)[number]>()
    .notNull(),
  rewardValue: jsonb("reward_value")
    .$type<{
      badgeId?: string;
      points?: number;
      discountCode?: string;
      discountPercentage?: number;
      bookCreditAmount?: number;
      [key: string]: unknown;
    }>()
    .notNull(),
  forWinner: boolean("for_winner").default(false).notNull(),
  forParticipation: boolean("for_participation").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  totalPoints: integer("total_points").default(0).notNull(),
  totalWins: integer("total_wins").default(0).notNull(),
  totalParticipation: integer("total_participation").default(0).notNull(),
  rank: integer("rank"),
  lastActivityAt: timestamp("last_activity_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const discountCodes = pgTable("discount_codes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  percentage: integer("percentage").notNull(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookCredits = pgTable("book_credits", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  amount: integer("amount").notNull(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  usedAt: timestamp("used_at"),
  usedFor: text("used_for"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
