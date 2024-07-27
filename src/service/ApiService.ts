import { MyCommand, MyTodoistTask } from "../utils/Model";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { TaskService } from "./TaskService";

export class ApiService {
    static #commandTemplate: MyCommand = {
        type: "item_add",
        temp_id: "",
        uuid: "",
        args: {},
    };

    static async addTasksFromTemplateWithSync(
        shortLivedToken: string,
        task: MyTodoistTask,
        userId: number
    ) {
        const commands = await ApiService.#createCommandsArray(task, userId);

        const config = {
            url: "https://api.todoist.com/sync/v9/sync",
            method: "POST",
            headers: {
                Authorization: `Bearer ${shortLivedToken}`,
            },
            data: {
                resource_types: ["items"],
                commands: commands,
            },
        };

        return axios(config);
    }

    static async getTaskById(shortLivedToken: string, taskId: string) {
        const api = new TodoistApi(shortLivedToken);
        // TODO: handle error cases (now the app crashes)
        return await api.getTasks({
            ids: [taskId],
        });
    }

    static async #createCommandsArray(task: MyTodoistTask, userId: number) {
        const dueStringList = await ApiService.#createDueStringsList(userId);
        let commandList: Array<MyCommand> = [];

        const customLabels = [...task.labels, "SpacedRepetitionJournal"];

        for (let i = 0; i < 4; i++) {
            const command: MyCommand = {
                ...ApiService.#commandTemplate,
                temp_id: uuidv4(),
                uuid: uuidv4(),
                args: {
                    ...task,
                    due: {
                        string: dueStringList[i],
                    },
                    labels: customLabels,
                },
            };
            commandList.push(command);
        }

        return commandList;
    }

    static async #createDueStringsList(userId: number) {
        let tasks = await TaskService.getTasksByUserId(userId);

        let dueDaysList: string[] = [];

        tasks.forEach((task) => {
            dueDaysList = [...dueDaysList, `in ${task.daysDue} days`];
        });

        return dueDaysList;
    }
}
