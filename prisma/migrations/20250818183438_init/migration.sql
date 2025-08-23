-- CreateTable
CREATE TABLE "metier"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "first_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "metier"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "metier"."User"("phone");
