CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"tittle" text NOT NULL,
	"slug" text NOT NULL,
	"seriesId" text,
	"releaseDate" timestamp NOT NULL,
	"synopsis" text NOT NULL,
	"variant" text NOT NULL,
	"status" text NOT NULL,
	"is_listed" boolean NOT NULL,
	"badge" text,
	"price" bigint NOT NULL,
	"slashed_from" bigint,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_book_variant" UNIQUE("tittle","variant")
);
--> statement-breakpoint
CREATE TABLE "tropes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bookId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tropes" ADD CONSTRAINT "tropes_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;