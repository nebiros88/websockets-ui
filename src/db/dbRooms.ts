import { Room, Player, Request, Ships, ShipPositions } from "../types/types";
import { getPlayerById } from "./dbPlayers";
import { AVAILABLE_RESPONSES } from "../constatnts";
import { sendResponseForAllClients, sendResponseForClients } from "../utils";

export let rooms: Room[] = [];

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
    game: {
      idGame: clientConnectionId,
      shipsPositions: [],
      turn: "",
    },
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

      rooms.forEach((room) => {
        if (room.roomUsers?.length === 2) {
          createGame(room.roomId);
        }
      });
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
    data: JSON.stringify(
      rooms.map((room: Room) => {
        return {
          roomId: room.roomId,
          roomUsers: room.roomUsers,
        };
      })
    ),
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
  sendResponseForClients(rooms[idx]?.roomUsers as Player[], AVAILABLE_RESPONSES.CREATE_GAME, { idGame: indexRoom });
}

// ADD_SHIPS

export function addShips(request: Request): void {
  const parsedRequest = JSON.parse(request.data);
  const { gameId, indexPlayer } = parsedRequest;

  const ships: Ships = [...parsedRequest.ships] as Ships;
  const roomIndex: number | undefined = rooms.findIndex((room) => room.game?.idGame === gameId);

  rooms[roomIndex]?.game.shipsPositions.push({
    ships: [...ships],
    indexPlayer,
  });

  if (rooms[roomIndex]?.game.shipsPositions.length === 2) {
    const roomId = rooms[roomIndex]?.roomId;
    startGame(roomId as string);
  }
}

function startGame(roomId: string): void {
  const room = rooms.find((room) => room.roomId === roomId) as Room;
  const { roomUsers } = room;
  const shipsPositions = room.game?.shipsPositions as ShipPositions[];

  sendResponseForClients(roomUsers as Player[], AVAILABLE_RESPONSES.START_GAME, shipsPositions as ShipPositions[]);

  rooms.map((room) => {
    if (room.roomId === roomId) {
      room.game.turn = roomId;
    }
  });

  sendResponseForClients(roomUsers as Player[], AVAILABLE_RESPONSES.TURN, { roomId });
}
