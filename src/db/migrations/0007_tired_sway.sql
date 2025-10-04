ALTER TABLE "base_books" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "base_books" ADD COLUMN "featured_order" bigint;