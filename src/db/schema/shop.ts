import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { bookVariant } from "./books";
import { merchVariant } from "./merch";

export const orderStatus = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
] as const;

export const paymentStatus = [
  "Pending",
  "Completed",
  "Failed",
  "Refunded",
] as const;

export const fulfillmentStatus = [
  "Pending",
  "Processing",
  "Fulfilled",
  "Failed",
] as const;

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status")
    .$type<(typeof orderStatus)[number]>()
    .default("Pending")
    .notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingFirstName: text("shipping_first_name").notNull(),
  shippingLastName: text("shipping_last_name").notNull(),
  shippingEmail: text("shipping_email").notNull(),
  shippingPhone: text("shipping_phone"),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZipCode: text("shipping_zip_code").notNull(),
  shippingCountry: text("shipping_country").notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status")
    .$type<(typeof paymentStatus)[number]>()
    .default("Pending")
    .notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  itemType: text("item_type").$type<"book" | "merch">().notNull(),
  bookVariantId: text("book_variant_id").references(() => bookVariant.id, {
    onDelete: "set null",
  }),
  merchVariantId: text("merch_variant_id").references(() => merchVariant.id, {
    onDelete: "set null",
  }),
  variantName: text("variant_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fulfillmentQueue = pgTable("fulfillment_queue", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderItemId: text("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  status: text("status")
    .$type<(typeof fulfillmentStatus)[number]>()
    .default("Pending")
    .notNull(),
  downloadLink: text("download_link"),
  errorMessage: text("error_message"),
  attempts: integer("attempts").default(0).notNull(),
  lastAttemptAt: timestamp("last_attempt_at"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
