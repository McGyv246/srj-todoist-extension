import {
    DoistCardActionParams,
    DoistCardRequest
} from "@doist/ui-extensions-core";
import {BadRequestError} from "../utils/CustomErrors";
import {MyTodoistTask} from "../utils/Model";
import {myBridgesSuccess} from "../utils/Bridges";
import {ApiService} from "./ApiService";
import {mySettingsCard} from "../utils/Cards";

export class ActionService {
    static async processRequest(doistRequest: DoistCardRequest, token: string | undefined) {

        if (!token) {
            throw new BadRequestError("No ShortLivedToken");
        }

        const { action, extensionType } = doistRequest;
        const { params } = action;

        if (extensionType === "context-menu") {
            if (action.actionType === "initial") {
                return await ActionService.#addTasks(params, token);
            } else {
                throw new BadRequestError("Unsupported action type");
            }
        } else if (extensionType === "settings") {
            if (action.actionType === "initial") {
                return Promise.resolve({card: mySettingsCard});
            } else if (action.actionType === "submit") {
                // TODO: implement data save
            } else {
                throw new BadRequestError("Unsupported action type");
            }
        } else {
            throw new BadRequestError("Unsupported extension type");
        }
    }

    static async #addTasks(params: DoistCardActionParams | undefined, token: string) {
        let parentTaskId =  ActionService.#checkAndHandleUndefinedStringArg(params?.sourceId, "parentId");
        let content = ActionService.#checkAndHandleUndefinedStringArg(params?.content, "content");

        const parentTask = (await ApiService.getTaskById(token, parentTaskId))[0]

        console.log(parentTask.labels);

        const myTask: MyTodoistTask = {
            content: content,
            parent_id: parentTaskId,
            labels: parentTask.labels,
        };

        const result = await ApiService.addTasksFromTemplateWithSync(token, myTask);

        console.log(result.data["sync_status"]);
        return { bridges: myBridgesSuccess }
    }

    static #checkAndHandleUndefinedStringArg(arg: any, argName: string) {
        if (arg) {
            return arg as string;
        } else {
            throw new BadRequestError(
                `Argument ${argName} of the request is undefined.`
            );
        }
    };
}