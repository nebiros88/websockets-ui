import WebSocket from "ws";

import { randomBytes } from "crypto";
import { AVAILABLE_REQUESTS, ERROR_MESSAGES } from "../../constatnts";
import { Request } from "../../types/types";
import { errorHandler } from "../../utils";
import { addClient, removeClient } from "../../db/dbClients";
import { requestHandler } from "../handlers/requestHandler";
import { deletePlayer } from "../../db/dbPlayers";
import { deleteRoom } from "../../db/dbRooms";

export default function connectionController(ws: WebSocket) {
  const clientConnectionId: string = randomBytes(16).toString("hex");
  addClient({ clientConnectionId });
  console.log("Connection created!");

  ws.on("message", (data: string) => {
    const request: Request = JSON.parse(data);

    console.log("Request: ", request);

    const { type } = request;
    if (!Object.values(AVAILABLE_REQUESTS).some((value) => value === type)) {
      console.log(ERROR_MESSAGES.IVALID_REQUEST_TYPE);
      errorHandler(ws);
      return;
    }

    try {
      requestHandler(ws, clientConnectionId, request);
    } catch (error) {
      console.log("Unexpected error occured!", error);
    }
  });

  ws.on("close", () => {
    removeClient({ clientConnectionId });
    deletePlayer(clientConnectionId);
    deleteRoom(clientConnectionId);
    console.log("Connection closed.");
  });
}
