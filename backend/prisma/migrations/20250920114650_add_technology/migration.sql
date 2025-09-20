-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('Techniques', 'Platforms', 'Tools', 'LanguagesFrameworks');

-- CreateEnum
CREATE TYPE "public"."Ring" AS ENUM ('Assess', 'Trial', 'Adopt', 'Hold');

-- CreateTable
CREATE TABLE "public"."Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "ring" "public"."Ring" NOT NULL,
    "techDescription" TEXT NOT NULL,
    "ringDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);
