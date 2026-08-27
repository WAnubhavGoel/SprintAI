/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentId]` on the table `quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversation_documentId_key" ON "conversation"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_documentId_key" ON "quiz"("documentId");
