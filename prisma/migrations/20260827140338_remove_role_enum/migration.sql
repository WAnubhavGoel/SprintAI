/*
  Warnings:

  - You are about to drop the column `role` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "role",
ADD COLUMN     "isUser" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "Role";
