import { wsServer } from "../ws-server/index";
import { Room, RoomsDb, Player, Request, UpdateRoomsResponse } from "../types/types";
import { getPlayerById } from "./dbPlayers";
import { AVAILABLE_RESPONSES } from "../constatnts";

export let rooms: RoomsDb = [];

export function createRoom(clientConnectionId: string) {
  const { name, index } = getPlayerById(clientConnectionId) as Player;
  const newRoom: Room = {
    roomId: clientConnectionId,
    roomUsers: [
      {
        name,
        index,
      },
    ],
  };

  rooms.push(newRoom as Room);

  const response = {
    type: AVAILABLE_RESPONSES.UPDATE_ROOM,
    data: JSON.stringify([...rooms]),
    id: 0,
  };

  sendUpdaeRoomsResponse(response);
}

export function addUserToRoom(clientConnectionId: string, request: Request) {
  const { indexRoom } = JSON.parse(request.data);
  const { name, index } = getPlayerById(clientConnectionId) as Player;
  rooms.map((room, idx) => {
    if (room.roomId === indexRoom) {
      rooms[idx]?.roomUsers?.push({ name, index });
    }
  });

  const response = {
    type: AVAILABLE_RESPONSES.UPDATE_ROOM,
    data: JSON.stringify([...rooms]),
    id: 0,
  };

  sendUpdaeRoomsResponse(response);
}

export function deleteRoom(clientConnectionId: string) {
  rooms = rooms.filter((room) => {
    if (room.roomId !== clientConnectionId) return room;
  });

  const response = {
    type: AVAILABLE_RESPONSES.UPDATE_ROOM,
    data: JSON.stringify([...rooms]),
    id: 0,
  };

  sendUpdaeRoomsResponse(response);
}

export function sendUpdaeRoomsResponse(response: UpdateRoomsResponse) {
  console.log("Response: ", JSON.stringify(response));
  wsServer.clients.forEach((client) => client.send(JSON.stringify(response)));
}
