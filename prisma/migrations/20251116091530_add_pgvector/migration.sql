/*
  Warnings:

  - You are about to drop the column `type` on the `evaluation_tasks` table. All the data in the column will be lost.
  - Made the column `cvDocumentId` on table `evaluation_tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectDocumentId` on table `evaluation_tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."evaluation_tasks" DROP CONSTRAINT "evaluation_tasks_cvDocumentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."evaluation_tasks" DROP CONSTRAINT "evaluation_tasks_projectDocumentId_fkey";

-- AlterTable
ALTER TABLE "public"."evaluation_tasks" DROP COLUMN "type",
ALTER COLUMN "cvDocumentId" SET NOT NULL,
ALTER COLUMN "projectDocumentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."evaluation_tasks" ADD CONSTRAINT "evaluation_tasks_cvDocumentId_fkey" FOREIGN KEY ("cvDocumentId") REFERENCES "public"."documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evaluation_tasks" ADD CONSTRAINT "evaluation_tasks_projectDocumentId_fkey" FOREIGN KEY ("projectDocumentId") REFERENCES "public"."documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
