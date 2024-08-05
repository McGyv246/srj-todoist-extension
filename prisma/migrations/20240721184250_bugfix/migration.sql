/*
  Warnings:

  - Made the column `userTodoistId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userTodoistId_fkey";

-- DropIndex
DROP INDEX "Task_userTodoistId_key";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "userTodoistId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userTodoistId_fkey" FOREIGN KEY ("userTodoistId") REFERENCES "User"("todoistId") ON DELETE RESTRICT ON UPDATE CASCADE;
