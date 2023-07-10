import { wsServer } from "../ws-server";

import { UpdateRoomsResponse, Player } from "../types/types";
import { AVAILABLE_RESPONSES } from "../constatnts";
import { getPlayerById } from "../db/dbPlayers";

export function sendResponseForAllClients(response: UpdateRoomsResponse) {
  console.log("Response: ", JSON.stringify(response));
  wsServer.clients.forEach((client) => client.send(JSON.stringify(response)));
}

export function sendResponseForClients(clientList: Player[], responseType: string, payload: any): void {
  clientList.forEach((client) => {
    let response;
    if (responseType === AVAILABLE_RESPONSES.CREATE_GAME) {
      const { idGame } = payload;
      const { ws } = getPlayerById(client.index) as Player;

      response = {
        type: AVAILABLE_RESPONSES.CREATE_GAME,
        data: JSON.stringify({
          idGame,
          idPlayer: client.index,
        }),
        id: 0,
      };

      console.log(JSON.stringify(response));

      ws!.send(JSON.stringify(response));
    }
  });
}
