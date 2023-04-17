/*
  Warnings:

  - You are about to drop the column `status` on the `posts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "announcement_date" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("active", "announcement_date", "created_at", "id", "text", "updated_at", "user_id") SELECT "active", "announcement_date", "created_at", "id", "text", "updated_at", "user_id" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
