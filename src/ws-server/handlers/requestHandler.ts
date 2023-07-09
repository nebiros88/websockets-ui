import { Request } from "types/types";
import WebSocket from "ws";

import { AVAILABLE_REQUESTS } from "../../constatnts";
import { createPlayer } from "../../db/dbPlayers";

export function requestHandler(ws: WebSocket, clientConnectionId: string, request: Request): void {
  switch (request.type) {
    case AVAILABLE_REQUESTS.REG:
      createPlayer(ws, clientConnectionId, request);
      break;
  }
}
