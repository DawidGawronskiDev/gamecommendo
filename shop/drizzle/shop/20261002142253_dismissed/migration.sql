CREATE TABLE "dismissed_game" (
	"user_id" text,
	"game_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dismissed_game_pkey" PRIMARY KEY("user_id","game_id")
);
--> statement-breakpoint
CREATE INDEX "dismissed_game_gameId_idx" ON "dismissed_game" ("game_id");--> statement-breakpoint
ALTER TABLE "dismissed_game" ADD CONSTRAINT "dismissed_game_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;