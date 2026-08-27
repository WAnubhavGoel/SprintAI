/*
  Warnings:

  - You are about to drop the column `lessonId` on the `document_chunk` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the `lesson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentId` to the `document_chunk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "document_chunk" DROP CONSTRAINT "document_chunk_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_userId_fkey";

-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_lessonId_fkey";

-- AlterTable
ALTER TABLE "document_chunk" DROP COLUMN "lessonId",
ADD COLUMN     "documentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "lessonId",
ADD COLUMN     "documentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "lesson";

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PROCESSING',
    "notesContent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunk" ADD CONSTRAINT "document_chunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
