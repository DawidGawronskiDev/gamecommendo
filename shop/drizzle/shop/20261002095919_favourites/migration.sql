CREATE TABLE "favourite_game" (
	"user_id" text,
	"game_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favourite_game_pkey" PRIMARY KEY("user_id","game_id")
);
--> statement-breakpoint
CREATE INDEX "favourite_game_gameId_idx" ON "favourite_game" ("game_id");--> statement-breakpoint
ALTER TABLE "favourite_game" ADD CONSTRAINT "favourite_game_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;