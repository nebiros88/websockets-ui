import WebSocket from "ws";

export type REQUESTS = {
  REG: string;
  CREATE_ROOM: string;
  ADD_USER_TO_ROOM: string;
  ADD_SHIPS: string;
  ATTACK: string;
  RANDOM_ATTACK: string;
};

export type RESPONSES = {
  REG: string;
  UPDATE_ROOM: string;
  CREATE_GAME: string;
  START_GAME: string;
  TURN: string;
  ATTACK: string;
};

export type Request = {
  type: string;
  data: string;
  id: string;
};

export type Player = {
  name: string;
  password?: string;
  index: string;
  ws?: WebSocket;
};

export type PlayersDb = Player[];

export type PlayerRequestBody = {
  name: string;
  password: string;
};

export type Client = {
  clientConnectionId: string;
};

export type Room = {
  roomId: string;
  roomUsers: Player[];
  game: Game;
};

export type UpdateRoomsResponse = {
  type: string;
  data: string;
  id: number;
};

export type Game = {
  idGame: number | string;
  shipsPositions: ShipPositions[];
  turn: string;
  playersScore: ScoreElement[];
};

export type ScoreElement = {
  playerId: string;
  totalPlayerScore: number;
};

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: string;
};

export type ShipType = {
  small: number;
  medium: number;
  large: number;
  huge: number;
};

export type Ships = Ship[];

export type ShipPositions = {
  ships: Ships;
  indexPlayer: string;
};

export enum ShotStatus {
  miss,
  killed,
  shot,
}
