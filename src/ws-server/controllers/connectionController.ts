import WebSocket from "ws";

// import { wsServer } from "../index";
// import { randomBytes } from "crypto";
import { AVAILABLE_REQUESTS, ERROR_MESSAGES } from "../../constatnts";
import { Request } from "../../types/types";
import { errorHandler } from "../../utils";

export default function connectionController(ws: WebSocket) {
  // const clientConnectionId: string = randomBytes(16).toString("hex");
  console.log("Connection created!");

  ws.on("message", (data: string) => {
    const request: Request = JSON.parse(data);

    console.log(request);

    const { type } = request;
    if (!Object.values(AVAILABLE_REQUESTS).some((value) => value === type)) {
      console.log(ERROR_MESSAGES.IVALID_REQUEST_TYPE);
      errorHandler(ws);
    }
  });
}
