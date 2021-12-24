import { WebSocketServer } from "ws";
import { insertOrders, getState } from "./db.js";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async function connection(ws) {
  ws.send(
    JSON.stringify({
      type: "SEND_STATE",
      payload: {
        state: await getState(),
      },
    })
  );
  ws.on("message", async (data) => {
    const action = JSON.parse(data);
    console.log(action);
    switch (action.type) {
      case "NEW_ORDER":
        const order = action.payload.order;
        const newOrders = await insertOrders(order, order.amount);
        const event = {
          type: "NEW_ORDERS",
          payload: {
            orders: newOrders,
          },
        };
        wss.clients.forEach((client) => client.send(JSON.stringify(event)));
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
