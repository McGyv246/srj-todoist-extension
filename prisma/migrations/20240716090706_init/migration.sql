-- CreateTable
CREATE TABLE "User" (
    "todoistId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("todoistId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "userTodoistId" TEXT,
    "daysDue" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_userTodoistId_key" ON "Task"("userTodoistId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userTodoistId_fkey" FOREIGN KEY ("userTodoistId") REFERENCES "User"("todoistId") ON DELETE SET NULL ON UPDATE CASCADE;
