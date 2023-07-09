export type REQUESTS = {
  REG: string;
  CREATE_ROOM: string;
  ADD_USER_TO_ROOM: string;
};

export type RESPONSES = {
  REG: string;
  UPDATE_ROOM: string;
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
  roomUsers: Player[] | null;
};

export type RoomsDb = Room[];

export type UpdateRoomsResponse = {
  type: string;
  data: string;
  id: number;
};
