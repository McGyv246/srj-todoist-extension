import { hash } from "../utils/Encryption";
import { myConstants } from "../utils/MyConstants";
import prisma from "../utils/PrismaClient";

export class UserService {
    static async createDefaultUser(todoistId: number) {
        let taskList: { daysDue: number }[] = [];

        myConstants.defaultDaysDue.forEach((value, index) => {
            taskList = [...taskList, { daysDue: value }];
        });

        await prisma.user.create({
            data: {
                todoistId: hash(`${todoistId}`),
                tasks: {
                    create: taskList,
                },
            },
        });
    }
}
