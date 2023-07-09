import WebSocket from "ws";

import { ERROR_MESSAGES } from "../constatnts";

export function errorHandler(ws: WebSocket, type?: string) {
  if (!type) {
    ws.send(
      JSON.stringify({
        error: true,
        errorText: ERROR_MESSAGES.IVALID_REQUEST_TYPE,
      })
    );
  }
}
