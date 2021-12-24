import { parse } from "url";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", function connection(ws) {});

function setupWebsocket(server) {
  server.on("upgrade", function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    if (pathname !== "/ws") {
      return;
    }
    console.log("upgrading to websocket");
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
  });
}

export default setupWebsocket;
