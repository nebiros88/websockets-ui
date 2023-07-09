export type REQUESTS = {
  REG: string;
};

export type Request = {
  type: string;
  data: string;
  id: string;
};

export type Player = {
  name?: string;
  password?: string;
  connectionId?: string;
};

export type PlayerRequestBody = {
  name: string;
  password: string;
};

export type Client = {
  clientConnectionId: string;
};
