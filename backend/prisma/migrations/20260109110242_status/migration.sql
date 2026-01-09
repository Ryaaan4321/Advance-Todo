/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Task_completed_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");
