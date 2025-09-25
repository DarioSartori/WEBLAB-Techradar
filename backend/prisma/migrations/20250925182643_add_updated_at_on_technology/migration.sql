/*
  Warnings:

  - Added the required column `updatedAt` to the `Technology` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Technology" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "public"."Technology" SET "updatedAt" = COALESCE("createdAt", NOW()) WHERE "updatedAt" IS NOT NULL;

ALTER TABLE "public"."Technology" ALTER COLUMN "updatedAt" DROP DEFAULT;
