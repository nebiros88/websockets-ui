import { Room, RoomsDb, Player, Request } from "../types/types";
import { getPlayerById } from "./dbPlayers";
import { AVAILABLE_RESPONSES } from "../constatnts";
import { sendResponseForAllClients, sendResponseForClients } from "../utils";

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
  updateRooms();
}

export function addUserToRoom(clientConnectionId: string, request: Request): void {
  const { indexRoom } = JSON.parse(request.data);
  const { name, index } = getPlayerById(clientConnectionId) as Player;

  rooms.map((room, idx) => {
    if (room.roomId === indexRoom) {
      if (rooms[idx]?.roomUsers?.some((user) => user.index === index)) return;
      rooms[idx]?.roomUsers?.push({ name, index });
      deleteRoom(clientConnectionId);

      if (rooms[idx]?.roomUsers?.length === 2) {
        createGame(room.roomId);
      }
    }
  });
}

export function deleteRoom(clientConnectionId: string): void {
  rooms = rooms.filter((room) => {
    if (room.roomId !== clientConnectionId) return room;
  });
  updateRooms();
}

export function updateRooms(): void {
  const response = {
    type: AVAILABLE_RESPONSES.UPDATE_ROOM,
    data: JSON.stringify([...rooms]),
    id: 0,
  };

  sendResponseForAllClients(response);
}

export function updateRoomsOnPlayerDelete(id: string) {
  rooms.map((room) => {
    if (room.roomUsers?.some((user) => user.index === id)) {
      room.roomUsers = room.roomUsers.filter((user) => {
        if (user.index !== id) return user;
      });
    }
  });
  deleteRoom(id);
}

// LET THE BATTLE BEGINS!!

function createGame(indexRoom: string): void {
  const idx = rooms.findIndex((room) => room.roomId === indexRoom);

  rooms[idx]!.game = {
    idGame: indexRoom,
  };

  sendResponseForClients(rooms[idx]?.roomUsers as Player[], AVAILABLE_RESPONSES.CREATE_GAME, { idGame: indexRoom });
}
