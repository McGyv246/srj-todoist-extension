import prisma from "../utils/PrismaClient";
import { hash } from "../utils/Encryption";
import { Prisma } from "@prisma/client";
import { IllegalArgumentError } from "../utils/CustomErrors";

export class TaskService {
    static async getTasksByUserId(userId: number | string) {
        return prisma.task.findMany({
            where: {
                userTodoistId: hash(`${userId}`),
            },
            orderBy: {
                id: "asc",
            },
        });
    }

    static async updateTaskDaysDueById(
        userId: number | string,
        taskIdList: number[],
        daysDueNewList: number[]
    ) {
        if (taskIdList.length !== daysDueNewList.length)
            throw new IllegalArgumentError(
                "List lengths must match",
                "taskIdList",
                "daysDueNewList"
            );

        let valueString = "";
        for (let i = 0; i < taskIdList.length; i++) {
            valueString = valueString.concat(
                `(${taskIdList[i]}, ${daysDueNewList[i]}),`
            );
        }

        // Removing last comma is necessary to avoid sql syntax error
        valueString = valueString.slice(0, -1);

        const query = `UPDATE public."Task" SET "daysDue" = new_values.new_value FROM ( VALUES ${valueString} ) AS new_values (m_id, new_value) WHERE "id" = new_values.m_id`;

        // Execute raw unsafe can be used since data is validated
        return prisma.$executeRawUnsafe(query);
    }
}
