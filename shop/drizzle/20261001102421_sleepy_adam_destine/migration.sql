-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "game_game_modes" (
	"game_id" integer,
	"game_mode_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_game_modes_pkey" PRIMARY KEY("game_id","game_mode_id")
);
--> statement-breakpoint
CREATE TABLE "game_genres" (
	"game_id" integer,
	"genre_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_genres_pkey" PRIMARY KEY("game_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "game_keywords" (
	"game_id" integer,
	"keyword_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_keywords_pkey" PRIMARY KEY("game_id","keyword_id")
);
--> statement-breakpoint
CREATE TABLE "game_modes" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_platforms" (
	"game_id" integer,
	"platform_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_platforms_pkey" PRIMARY KEY("game_id","platform_id")
);
--> statement-breakpoint
CREATE TABLE "game_player_perspectives" (
	"game_id" integer,
	"player_perspective_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_player_perspectives_pkey" PRIMARY KEY("game_id","player_perspective_id")
);
--> statement-breakpoint
CREATE TABLE "game_themes" (
	"game_id" integer,
	"theme_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_themes_pkey" PRIMARY KEY("game_id","theme_id")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"summary" text,
	"storyline" text,
	"url" varchar(255),
	"cover_url" varchar(255),
	"first_release_date" date,
	"rating" double precision,
	"rating_count" integer,
	"aggregated_rating" double precision,
	"aggregated_rating_count" integer,
	"total_rating" double precision,
	"total_rating_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_perspectives" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screenshots" (
	"id" integer PRIMARY KEY,
	"game_id" integer NOT NULL,
	"url" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_player_perspectives" ADD CONSTRAINT "game_player_perspectives_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_player_perspectives" ADD CONSTRAINT "game_player_perspectives_player_perspective_id_fkey" FOREIGN KEY ("player_perspective_id") REFERENCES "player_perspectives"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_game_modes" ADD CONSTRAINT "game_game_modes_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_game_modes" ADD CONSTRAINT "game_game_modes_game_mode_id_fkey" FOREIGN KEY ("game_mode_id") REFERENCES "game_modes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_themes" ADD CONSTRAINT "game_themes_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_themes" ADD CONSTRAINT "game_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_keywords" ADD CONSTRAINT "game_keywords_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_keywords" ADD CONSTRAINT "game_keywords_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE CASCADE;
*/