/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "metier"."User";

-- CreateTable
CREATE TABLE "metier"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "first_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "metier"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "metier"."user"("phone");
