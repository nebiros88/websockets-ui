import { REQUESTS, RESPONSES } from "./types/types";

export const AVAILABLE_REQUESTS: REQUESTS = {
  REG: "reg",
  CREATE_ROOM: "create_room",
  ADD_USER_TO_ROOM: "add_user_to_room",
  ADD_SHIPS: "add_ships",
  ATTACK: "attack",
  RANDOM_ATTACK: "randomAttack",
};

export const AVAILABLE_RESPONSES: RESPONSES = {
  REG: "reg",
  UPDATE_ROOM: "update_room",
  CREATE_GAME: "create_game",
  START_GAME: "start_game",
  TURN: "turn",
  ATTACK: "attack",
  FINISH: "finish",
  UPDATE_WINNER: "update_winners",
};

export const ERROR_MESSAGES = {
  IVALID_REQUEST_TYPE: "Invalid type of request!",
  INVALID_REQUEST_BODY: "Invallid request body!",
};
