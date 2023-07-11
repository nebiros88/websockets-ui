import { wsServer } from "../ws-server";

import { UpdateRoomsResponse, Player, ShipPositions } from "../types/types";
import { AVAILABLE_RESPONSES } from "../constatnts";
import { getPlayerById } from "../db/dbPlayers";

export function sendResponseForAllClients(response: UpdateRoomsResponse) {
  console.log("Response: ", JSON.stringify(response));
  wsServer.clients.forEach((client) => client.send(JSON.stringify(response)));
}

export function sendResponseForClients(clientList: Player[], responseType: string, payload: any): void {
  clientList.forEach((client) => {
    let response;

    const { ws } = getPlayerById(client.index) as Player;

    if (responseType === AVAILABLE_RESPONSES.CREATE_GAME) {
      const { idGame } = payload;

      response = {
        type: responseType,
        data: JSON.stringify({
          idGame,
          idPlayer: client.index,
        }),
        id: 0,
      };

      console.log(JSON.stringify(response));

      ws!.send(JSON.stringify(response));
    }

    if (responseType === AVAILABLE_RESPONSES.START_GAME) {
      const shipsPosition = payload.find((el: any) => el.indexPlayer === client.index) as ShipPositions;

      response = {
        type: responseType,
        data: JSON.stringify({
          ...shipsPosition.ships,
          currentPlayerIndex: shipsPosition.indexPlayer,
        }),
        id: 0,
      };

      console.log(JSON.stringify(response));

      ws!.send(JSON.stringify(response));
    }
  });
}
