import {
    DoistCardActionParams,
    DoistCardRequest,
} from "@doist/ui-extensions-core";
import { BadRequestError } from "../utils/CustomErrors";
import { MyTodoistTask } from "../utils/Model";
import {
    settingsSavedBridgeError,
    settingsSavedBridgeSuccess,
    tasksSetBridgeSuccess,
} from "../utils/Bridges";
import { ApiService } from "./ApiService";
import { AdaptiveCardService } from "./AdaptiveCardService";
import { myConstants } from "../utils/MyConstants";
import { UserService } from "./UserService";
import { Prisma } from "@prisma/client";

export class ActionService {
    static async processRequest(
        doistRequest: DoistCardRequest,
        token: string | undefined
    ) {
        if (!token) {
            throw new BadRequestError("No ShortLivedToken");
        }

        const { action, extensionType, context } = doistRequest;
        const { params } = action;
        const { user } = context;

        try {
            await UserService.createDefaultUser(Number(user.id));
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // If error.code === "P2002" it means the user already exist. Nothing must be done.
                if (error.code !== "P2002") {
                    throw error;
                }
            }
        }

        if (extensionType === "context-menu") {
            if (action.actionType === "initial") {
                return await ActionService.#addTasks(
                    params,
                    token,
                    Number(user.id)
                );
            } else {
                throw new BadRequestError("Unsupported action type");
            }
        } else if (extensionType === "settings") {
            if (action.actionType === "initial") {
                return Promise.resolve({
                    card: AdaptiveCardService.createSettingsCard(
                        myConstants.defaultDaysDue
                    ),
                });
            } else if (action.actionType === "submit") {
                console.log("Data submitted!\nData:\n", action.inputs);
                if (ActionService.#isSettingsDataValid(action.inputs)) {
                    return Promise.resolve({
                        card: AdaptiveCardService.createSettingsCard(
                            myConstants.defaultDaysDue
                        ),
                        bridges: settingsSavedBridgeSuccess,
                    });
                } else {
                    return Promise.resolve({
                        card: AdaptiveCardService.createSettingsCard(
                            myConstants.defaultDaysDue
                        ),
                        bridges: settingsSavedBridgeError,
                    });
                }
            } else {
                throw new BadRequestError("Unsupported action type");
            }
        } else {
            throw new BadRequestError("Unsupported extension type");
        }
    }

    static async #addTasks(
        params: DoistCardActionParams | undefined,
        token: string,
        userId: number
    ) {
        let parentTaskId = ActionService.#checkAndHandleUndefinedStringArg(
            params?.sourceId,
            "parentId"
        );
        let content = ActionService.#checkAndHandleUndefinedStringArg(
            params?.content,
            "content"
        );

        const parentTask = (
            await ApiService.getTaskById(token, parentTaskId)
        )[0];

        console.log(parentTask.labels);

        const myTask: MyTodoistTask = {
            content: content,
            parent_id: parentTaskId,
            labels: parentTask.labels,
        };

        const result = await ApiService.addTasksFromTemplateWithSync(
            token,
            myTask,
            userId
        );

        console.log(result.data["sync_status"]);
        return { bridges: tasksSetBridgeSuccess };
    }

    static #checkAndHandleUndefinedStringArg(arg: any, argName: string) {
        if (arg) {
            return arg as string;
        } else {
            throw new BadRequestError(
                `Argument ${argName} of the request is undefined.`
            );
        }
    }

    static #isSettingsDataValid(data: any) {
        if (
            !data ||
            (Object.keys(data).length === 0 && data.constructor === Object)
        )
            return false;

        for (let field in data) {
            if (data[field]) {
                let number = parseInt(data[field]);
                if (
                    !isNaN(number) &&
                    isFinite(number) &&
                    number > 0 &&
                    number < 1000000
                ) {
                    continue;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
}
