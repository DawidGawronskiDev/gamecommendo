CREATE TABLE "library_game" (
	"user_id" text,
	"game_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "library_game_pkey" PRIMARY KEY("user_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "member_steam" (
	"user_id" text PRIMARY KEY,
	"steam_id" text NOT NULL,
	"synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "library_game_gameId_idx" ON "library_game" ("game_id");--> statement-breakpoint
ALTER TABLE "library_game" ADD CONSTRAINT "library_game_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_steam" ADD CONSTRAINT "member_steam_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;