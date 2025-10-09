ALTER TABLE "books" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "slashed_from" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "book_variants" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "book_variants" ALTER COLUMN "slashed_from" SET DATA TYPE numeric(10, 2);