CREATE TABLE "services_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"value_type" text DEFAULT 'text' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
