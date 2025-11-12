CREATE TABLE "fulfillment_queue" (
	"id" text PRIMARY KEY NOT NULL,
	"order_item_id" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"download_link" text,
	"error_message" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp,
	"fulfilled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"item_type" text NOT NULL,
	"book_variant_id" text,
	"merch_variant_id" text,
	"variant_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_number" text NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"shipping_first_name" text NOT NULL,
	"shipping_last_name" text NOT NULL,
	"shipping_email" text NOT NULL,
	"shipping_phone" text,
	"shipping_address" text NOT NULL,
	"shipping_city" text NOT NULL,
	"shipping_state" text NOT NULL,
	"shipping_zip_code" text NOT NULL,
	"shipping_country" text NOT NULL,
	"payment_method" text,
	"payment_status" text DEFAULT 'Pending' NOT NULL,
	"payment_reference" text,
	"transaction_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_payment_reference_unique" UNIQUE("payment_reference")
);
--> statement-breakpoint
ALTER TABLE "fulfillment_queue" ADD CONSTRAINT "fulfillment_queue_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_book_variant_id_book_variants_id_fk" FOREIGN KEY ("book_variant_id") REFERENCES "public"."book_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_merch_variant_id_merch_variants_id_fk" FOREIGN KEY ("merch_variant_id") REFERENCES "public"."merch_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;