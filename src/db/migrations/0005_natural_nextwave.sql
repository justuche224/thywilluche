ALTER TABLE "books" ADD CONSTRAINT "books_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "unique_book_slug" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "tropes" ADD CONSTRAINT "tropes_slug_unique" UNIQUE("slug");