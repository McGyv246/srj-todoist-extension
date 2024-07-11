import {IncomingMessage} from "http";

export interface MyTodoistTask {
  content: string;
  parent_id: string;
  project_id?: string;
  labels: string[];
}

export interface MyCommand {
  type: "item_add" | "reminder_add";
  temp_id: string;
  uuid: string;
  args: any;
}

export class IncomingMessageWithRawBody extends IncomingMessage {
  rawBody?: Buffer
}
