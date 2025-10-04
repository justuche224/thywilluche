import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const variant = [
  "Hardcover",
  "Softcover",
  "E-Book",
  "Audiobook",
  "Signed",
] as const;

export const status = [
  "Available",
  "Sold Out",
  "On Hold",
  "Preorder",
  "Coming Soon",
] as const;

export const baseBook = pgTable("base_books", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tittle: text("tittle").notNull().unique(),
  slug: text("slug").notNull().unique(),
  seriesId: text("seriesId"),
  releaseDate: timestamp("releaseDate").notNull(),
  synopsis: text("synopsis").notNull(),
  tags: text("tags").array().default([]).notNull(),
  badge: text("badge"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  featuredOrder: bigint("featured_order", { mode: "number" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const bookVariant = pgTable(
  "book_variants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    baseBookId: text("base_book_id")
      .notNull()
      .references(() => baseBook.id, { onDelete: "cascade" }),
    variant: text("variant").$type<(typeof variant)[number]>().notNull(),
    status: text("status").$type<(typeof status)[number]>().notNull(),
    isListed: boolean("is_listed").notNull(),
    price: bigint("price", { mode: "number" }).notNull(),
    slashedFrom: bigint("slashed_from", { mode: "number" }),
    imageUrl: text("image_url").notNull(),
    externalLinks: text("external_links"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("unique_base_book_variant").on(table.baseBookId, table.variant),
  ]
);

export const book = pgTable(
  "books",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tittle: text("tittle").notNull(),
    slug: text("slug").notNull().unique(),
    seriesId: text("seriesId"),
    releaseDate: timestamp("releaseDate").notNull(),
    synopsis: text("synopsis").notNull(),
    variant: text("variant").$type<(typeof variant)[number]>().notNull(),
    status: text("status").$type<(typeof status)[number]>().notNull(),
    isListed: boolean("is_listed").notNull(),
    badge: text("badge"),
    price: bigint("price", { mode: "number" }).notNull(),
    slashedFrom: bigint("slashed_from", { mode: "number" }),
    tags: text("tags").array().default([]).notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("unique_book_variant").on(table.tittle, table.variant),
    unique("unique_book_slug").on(table.slug),
  ]
);

export const trope = pgTable("tropes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  baseBookId: text("base_book_id")
    .notNull()
    .references(() => baseBook.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
