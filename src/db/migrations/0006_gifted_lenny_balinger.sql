CREATE TABLE "base_books" (
	"id" text PRIMARY KEY NOT NULL,
	"tittle" text NOT NULL,
	"slug" text NOT NULL,
	"seriesId" text,
	"releaseDate" timestamp NOT NULL,
	"synopsis" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"badge" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "base_books_tittle_unique" UNIQUE("tittle"),
	CONSTRAINT "base_books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "book_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"base_book_id" text NOT NULL,
	"variant" text NOT NULL,
	"status" text NOT NULL,
	"is_listed" boolean NOT NULL,
	"price" bigint NOT NULL,
	"slashed_from" bigint,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_base_book_variant" UNIQUE("base_book_id","variant")
);
--> statement-breakpoint
ALTER TABLE "tropes" RENAME COLUMN "bookId" TO "base_book_id";--> statement-breakpoint
ALTER TABLE "tropes" DROP CONSTRAINT "tropes_bookId_books_id_fk";
--> statement-breakpoint
ALTER TABLE "book_variants" ADD CONSTRAINT "book_variants_base_book_id_base_books_id_fk" FOREIGN KEY ("base_book_id") REFERENCES "public"."base_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tropes" ADD CONSTRAINT "tropes_base_book_id_base_books_id_fk" FOREIGN KEY ("base_book_id") REFERENCES "public"."base_books"("id") ON DELETE cascade ON UPDATE no action;