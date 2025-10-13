CREATE TABLE "community_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"post_id" text NOT NULL,
	"parent_id" text,
	"is_edited" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_group_memberships" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"group_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_groups_name_unique" UNIQUE("name"),
	CONSTRAINT "community_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "community_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text,
	"comment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_views" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"excerpt" text,
	"image_url" text,
	"author_id" text NOT NULL,
	"group_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"approved_at" timestamp,
	"approved_by" text,
	"rejection_reason" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_shares" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_group_memberships" ADD CONSTRAINT "community_group_memberships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_group_memberships" ADD CONSTRAINT "community_group_memberships_group_id_community_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."community_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_comment_id_community_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."community_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_views" ADD CONSTRAINT "community_post_views_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_views" ADD CONSTRAINT "community_post_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_group_id_community_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."community_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_shares" ADD CONSTRAINT "community_shares_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_shares" ADD CONSTRAINT "community_shares_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;