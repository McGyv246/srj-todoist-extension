import prisma from "../utils/PrismaClient";
import { hash } from "../utils/Encryption";

export class TaskService {
    static async getTasksByUserId(userId: number) {
        return prisma.task.findMany({
            where: {
                userTodoistId: hash(`${userId}`),
            },
            orderBy: {
                id: "asc",
            },
        });
    }
}
