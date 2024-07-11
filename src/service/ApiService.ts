import {MyCommand, MyTodoistTask} from "../utils/Model";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {TodoistApi} from "@doist/todoist-api-typescript"

export class ApiService {
  static #commandTemplate: MyCommand = {
    type: "item_add",
    temp_id: "",
    uuid: "",
    args: {},
  };

  static addTasksFromTemplateWithSync(
      shortLivedToken: string,
      task: MyTodoistTask
  ) {
    const commands = ApiService.#createCommandsArray(task);

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
  };

  static async getTaskById(
      shortLivedToken: string,
      taskId: string
  ){
    const api = new TodoistApi(shortLivedToken)
    // TODO: handle error cases (now the app crashes)
    return await api.getTasks(
        {
          ids: [taskId]
        }
    )
  }

  static #createCommandsArray(task: MyTodoistTask) {
    const dueStringList = ApiService.#createDueStringsList();
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

  static #createDueStringsList() {
    return ["tomorrow", "in 7 days", "in 21 days", "in 42 days"];
  }
}




