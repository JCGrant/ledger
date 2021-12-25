import { WebSocketServer } from "ws";
import {
  insertOrders,
  getState,
  getOrders,
  getItems,
  updateOrder,
} from "./db.js";

const wss = new WebSocketServer({ noServer: true });

setInterval(async () => {
  const [items, orders] = await Promise.all([getItems(), getOrders()]);
  items.forEach(async (item) => {
    const buys = orders
      .filter(
        (order) =>
          !order.completed &&
          order.direction === "buy" &&
          order.itemId === item.id
      )
      .sort((a, b) => b.price - a.price);
    const highestBuy = buys[0];
    if (!highestBuy) {
      return;
    }
    const sells = orders
      .filter(
        (order) =>
          !order.completed &&
          order.direction === "sell" &&
          order.itemId === item.id &&
          order.userId !== highestBuy.userId
      )
      .sort((a, b) => a.price - b.price);
    const lowestSell = sells[0];
    if (!lowestSell) {
      return;
    }
    const updatedOrders = await Promise.all([
      updateOrder(highestBuy.id, [["completed", true]]),
      updateOrder(lowestSell.id, [["completed", true]]),
    ]);
    const event = {
      type: "ORDERS_COMPLETED",
      payload: {
        orders: updatedOrders,
      },
    };
    wss.clients.forEach((client) => client.send(JSON.stringify(event)));
    // create transaction
    // update user wallet
    // create user inventory, and move the owned items to other user
    // display wallet and items in user profiles
  });
}, 1000);

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
