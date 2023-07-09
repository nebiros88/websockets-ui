import { REQUESTS, RESPONSES } from "./types/types";

export const AVAILABLE_REQUESTS: REQUESTS = {
  REG: "reg",
  CREATE_ROOM: "create_room",
  ADD_USER_TO_ROOM: "add_user_to_room",
};

export const AVAILABLE_RESPONSES: RESPONSES = {
  REG: "reg",
  UPDATE_ROOM: "update_room",
};

export const ERROR_MESSAGES = {
  IVALID_REQUEST_TYPE: "Invalid type of request!",
  INVALID_REQUEST_BODY: "Invallid request body!",
};
