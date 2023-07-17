import { Request } from "types/types";
import WebSocket from "ws";

import { AVAILABLE_REQUESTS } from "../../constatnts";
import { createPlayer } from "../../db/dbPlayers";
import { createRoom, addUserToRoom, addShips, randomAttack, attack } from "../../db/dbRooms";

export function requestHandler(ws: WebSocket, clientConnectionId: string, request: Request): void {
  switch (request.type) {
    case AVAILABLE_REQUESTS.REG:
      createPlayer(ws, clientConnectionId, request);
      break;
    case AVAILABLE_REQUESTS.CREATE_ROOM:
      createRoom(clientConnectionId);
      break;
    case AVAILABLE_REQUESTS.ADD_USER_TO_ROOM:
      addUserToRoom(clientConnectionId, request);
      break;
    case AVAILABLE_REQUESTS.ADD_SHIPS:
      addShips(request);
      break;
    case AVAILABLE_REQUESTS.RANDOM_ATTACK:
      randomAttack(request);
      break;
    case AVAILABLE_REQUESTS.ATTACK:
      attack(request);
      break;
  }
}
