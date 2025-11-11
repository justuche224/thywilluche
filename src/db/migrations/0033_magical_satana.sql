CREATE TABLE "base_merch" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"badge" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"featured_order" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "base_merch_name_unique" UNIQUE("name"),
	CONSTRAINT "base_merch_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "merch_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"base_merch_id" text NOT NULL,
	"variant" text NOT NULL,
	"status" text NOT NULL,
	"is_listed" boolean NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"slashed_from" numeric(10, 2),
	"image_url" text NOT NULL,
	"external_links" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_base_merch_variant" UNIQUE("base_merch_id","variant")
);
--> statement-breakpoint
ALTER TABLE "merch_variants" ADD CONSTRAINT "merch_variants_base_merch_id_base_merch_id_fk" FOREIGN KEY ("base_merch_id") REFERENCES "public"."base_merch"("id") ON DELETE cascade ON UPDATE no action;