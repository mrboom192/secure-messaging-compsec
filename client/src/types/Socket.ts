import { Message } from "./Message";

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
}

export interface ClientToServerEvents {
  send_message: (data: Message) => void;
  disconnect: () => void;
}
