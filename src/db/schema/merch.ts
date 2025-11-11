import {
  bigint,
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const variant = [
  "Small",
  "Medium",
  "Large",
  "XL",
  "XXL",
  "One Size",
] as const;

export const status = [
  "Available",
  "Sold Out",
  "On Hold",
  "Preorder",
  "Coming Soon",
] as const;

export const baseMerch = pgTable("base_merch", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
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

export const merchVariant = pgTable(
  "merch_variants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    baseMerchId: text("base_merch_id")
      .notNull()
      .references(() => baseMerch.id, { onDelete: "cascade" }),
    variant: text("variant").$type<(typeof variant)[number]>().notNull(),
    status: text("status").$type<(typeof status)[number]>().notNull(),
    isListed: boolean("is_listed").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    slashedFrom: decimal("slashed_from", { precision: 10, scale: 2 }),
    imageUrl: text("image_url").notNull(),
    externalLinks: text("external_links"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("unique_base_merch_variant").on(table.baseMerchId, table.variant),
  ]
);
