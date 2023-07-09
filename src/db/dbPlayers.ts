import WebSocket from "ws";

import { Player, Request, PlayerRequestBody, PlayersDb } from "types/types";
import { ERROR_MESSAGES } from "../constatnts";

export let players: PlayersDb = [];

function validatePlayerBody(player: PlayerRequestBody) {
  if (!Object.values(player).length || !player.name.length || !player.password.length) return false;
  if (players.some((el) => el.name == player.name)) return false;
  return true;
}

export function createPlayer(ws: WebSocket, clientConnectionId: string, request: Request) {
  let response;
  const requestBody: { name: string; password: string } = JSON.parse(request.data);
  const isValid = validatePlayerBody(requestBody);

  if (!isValid) {
    response = {
      type: request.type,
      data: {
        name: "",
        index: "",
        error: true,
        errorText: ERROR_MESSAGES.INVALID_REQUEST_BODY,
      },
    };

    console.log("Response: ", JSON.stringify(response));

    ws.send(JSON.stringify(response));
    return;
  }

  const newPlayer: Player = {
    name: requestBody.name,
    password: requestBody.password,
    index: clientConnectionId,
  };

  players.push(newPlayer);

  response = {
    type: request.type,
    data: JSON.stringify({
      name: newPlayer.name,
      index: requestBody.password,
      error: false,
      errorText: "",
    }),
    id: 0,
  };

  console.log("Response: ", JSON.stringify(response));

  ws.send(JSON.stringify(response));
}

export function deletePlayer(clientConnectionId: string): void {
  players = players.filter((player) => {
    if (player.index !== clientConnectionId) return player;
  });
}

export function getPlayerById(id: string): Player | void {
  const player = players.find((player) => player.index === id);
  return player;
}
