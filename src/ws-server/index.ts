import { WebSocketServer } from "ws";

const WS_SERVER_PORT = process.env.WS_SERVER_PORT || 3000;

export const wsServer = new WebSocketServer({ port: WS_SERVER_PORT as number });
