import { Room, Player, Request, Ships, ShipPositions, ShipType, ShootData, Ship } from "../types/types";
import { getPlayerById } from "./dbPlayers";
import { AVAILABLE_REQUESTS, AVAILABLE_RESPONSES } from "../constatnts";
import { sendResponseForAllClients, sendResponseForClients } from "../utils";
import { updateWinners } from "./dbWinners";

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
      playersScore: [],
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
      const user: Player = { name, index };
      rooms[idx]?.roomUsers.push(user);
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

  rooms[idx]?.roomUsers?.forEach((user) => {
    rooms[idx]?.game.playersScore.push({
      playerId: user.index,
      totalPlayerScore: 20,
      shootingMap: [] as ShootData[],
    });
  });

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

  setPlayersTurn(roomId, roomUsers[0]?.index);
}

// GAME_PROCESS

export function randomAttack(request: Request): void {
  const { gameId, indexPlayer } = JSON.parse(request.data);
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  const requestData: Request = {
    type: AVAILABLE_REQUESTS.RANDOM_ATTACK,
    data: JSON.stringify({
      gameId,
      x,
      y,
      indexPlayer,
    }),
    id: "0",
  };

  attack(requestData);
}

// Attack

export function attack(request: Request): void {
  const { gameId, x, y, indexPlayer } = JSON.parse(request.data);

  const result = {
    type: AVAILABLE_RESPONSES.ATTACK,
    data: {
      position: {
        x,
        y,
      },
      currentPlayer: indexPlayer,
      status: "miss",
    },
  };

  rooms.map((room) => {
    if (room.roomId === gameId) {
      const shipsPosition = room.game.shipsPositions.find((el) => el.indexPlayer !== indexPlayer);

      shipsPosition?.ships.map((ship) => {
        const shipType = ship.type as keyof ShipType;
        const shipLength = SHIPS_LENGTH_MAP[shipType];

        if (!ship.direction) {
          if (x >= ship.position.x && x <= ship.position.x + shipLength) {
            if (y === ship.position.y) {
              reducePlayerScore(gameId, indexPlayer);

              if (shipLength === 1) {
                result.data.status = "killed";
              }

              if (shipLength > 1) {
                result.data.status = getShootStatus(gameId, indexPlayer, ship);
              }
            }
          }
        } else {
          if (x === ship.position.x) {
            if (y >= ship.position.y && y <= ship.position.y + shipLength) {
              reducePlayerScore(gameId, indexPlayer);

              if (shipLength === 1) {
                result.data.status = "killed";
              }

              if (shipLength > 1) {
                result.data.status = getShootStatus(gameId, indexPlayer, ship);
              }
            }
          }
        }
      });
    }
  });

  const clients = (rooms.find((room) => room.roomId === gameId) as Room).roomUsers;

  sendResponseForClients(clients, AVAILABLE_RESPONSES.ATTACK, result);

  addShootingNote(gameId, indexPlayer, { x, y, result: result.data.status });

  if (checkGameState(gameId)) {
    finishGame(gameId, clients, indexPlayer);
    return;
  }

  // Toggle user's turn

  if (result.data.status === "miss") {
    const nextTurnPlayerId = clients.find((player) => player.index !== indexPlayer)?.index;
    setPlayersTurn(gameId, nextTurnPlayerId);
    return;
  }
  setPlayersTurn(gameId, indexPlayer);
}

// Reduce players' score

function reducePlayerScore(gameId: string, playerId: string): void {
  const roomIndex = rooms.findIndex((room) => room.roomId === gameId);

  rooms[roomIndex]?.game.playersScore.map((player) => {
    if (player.playerId !== playerId) {
      player.totalPlayerScore = player.totalPlayerScore - 1;
    }
  });
}

const SHIPS_LENGTH_MAP: ShipType = {
  small: 1,
  medium: 2,
  large: 3,
  huge: 4,
};

// Set players' turn

function setPlayersTurn(roomId: string, playerId: string | undefined): void {
  if (playerId) {
    rooms.map((room) => {
      if (room.roomId === roomId) {
        room.game.turn = playerId;
      }
      sendResponseForClients(room.roomUsers as Player[], AVAILABLE_RESPONSES.TURN, { playerId });
    });
  }
}

function checkGameState(gameId: string): boolean {
  let result = false;

  rooms.map((room) => {
    if (room.roomId === gameId) {
      room.game.playersScore.map((el) => {
        if (el.totalPlayerScore === 0) result = true;
      });
    }
  });

  return result;
}

function finishGame(roomId: string, clients: Player[], winnerId: string): void {
  const winnerName = getPlayerById(winnerId) as Player;
  sendResponseForClients(clients, AVAILABLE_RESPONSES.FINISH, { winnerId });
  deleteRoom(roomId);
  updateWinners(winnerName.name, clients);
}

function addShootingNote(gameId: string, playerId: string, shootNote: ShootData): void {
  rooms.map((room) => {
    if (room.roomId === gameId) {
      room.game.playersScore.map((el) => {
        if (el.playerId === playerId) el.shootingMap.push(shootNote);
      });
    }
  });
}

function getPlayersShootingNotes(gameId: string, playerId: string): ShootData[] {
  let result = [] as ShootData[];
  rooms.map((room) => {
    if (room.roomId === gameId) {
      room.game.playersScore.map((el) => {
        if (el.playerId === playerId) {
          result = el.shootingMap.filter((note) => note.result !== "miss") as ShootData[];
        }
      });
    }
  });
  return result;
}

function getShootStatus(gameId: string, playerId: string, ship: Ship): string {
  const playerShootingNotes = getPlayersShootingNotes(gameId, playerId);
  let shootStatus: string = "killed";

  const shipType = ship.type as keyof ShipType;
  const shipLength = SHIPS_LENGTH_MAP[shipType];

  let shootingMatches = [] as ShootData[];

  playerShootingNotes.map((note) => {
    if (note.y === ship.position.y) {
      if (note.x >= ship.position.x && note.x <= ship.position.x + shipLength) {
        shootingMatches.push(note);
      }
    }

    if (note.x === ship.position.x) {
      if (note.y >= ship.position.y && note.y <= ship.position.y + shipLength) {
        shootingMatches.push(note);
      }
    }
  });

  if (shootingMatches.length < shipLength - 1) shootStatus = "shot";

  return shootStatus;
}
