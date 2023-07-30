import "dotenv/config";

import { httpServer } from "./src/http_server";
import { wsServer, WS_SERVER_PORT } from "./src/ws-server";
import connectionController from "./src/ws-server/controllers/connectionController";

const HTTP_PORT = process.env.HTTP_SERVER_PORT || 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`Started websocket server, listening requests on ws://localhost:${WS_SERVER_PORT}`);

wsServer.on("connection", connectionController);
