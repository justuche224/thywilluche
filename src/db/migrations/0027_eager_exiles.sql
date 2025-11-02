CREATE TABLE "book_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"base_book_id" text NOT NULL,
	"reviewer_name" text NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_base_book_id_base_books_id_fk" FOREIGN KEY ("base_book_id") REFERENCES "public"."base_books"("id") ON DELETE cascade ON UPDATE no action;