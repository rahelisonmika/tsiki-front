/*
  Warnings:

  - A unique constraint covering the columns `[cin]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_cin_key" ON "metier"."user"("cin");
