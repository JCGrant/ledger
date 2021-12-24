import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

const state = {
  orders: [],
};

wss.on("connection", function connection(ws) {
  ws.send(
    JSON.stringify({
      type: "SEND_STATE",
      payload: {
        state,
      },
    })
  );
  ws.on("message", (data) => {
    const action = JSON.parse(data);
    console.log(action);
    switch (action.type) {
      case "NEW_ORDER":
        state.orders = [action.payload.order, ...state.orders];
        wss.clients.forEach((client) => client.send(JSON.stringify(action)));
        return;
    }
  });
});

function setupWebsocket(server) {
  server.on("upgrade", function upgrade(request, socket, head) {
    if (request.url !== "/ws") {
      return;
    }
    console.log("upgrading to websocket");
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
  });
}

export default setupWebsocket;
