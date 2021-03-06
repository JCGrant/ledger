import { WebSocketServer } from "ws";
import { arrToMap, calculateSettledPrice } from "common/utils.js";
import {
  insertOrders,
  getState,
  getOrders,
  getItems,
  updateOrder,
  insertTransaction,
  updateUser,
  getUsers,
  deleteOrder,
} from "./db.js";

const wss = new WebSocketServer({ noServer: true });

function compareSellOrders(a, b) {
  if (a.price < b.price) {
    return -1;
  }
  if (a.price > b.price) {
    return 1;
  }
  if (a.timestamp < b.timestamp) {
    return -1;
  }
  if (a.timestamp > b.timestamp) {
    return 1;
  }
  return 0;
}

function compareBuyOrders(a, b) {
  if (a.price < b.price) {
    return 1;
  }
  if (a.price > b.price) {
    return -1;
  }
  if (a.timestamp < b.timestamp) {
    return -1;
  }
  if (a.timestamp > b.timestamp) {
    return 1;
  }
  return 0;
}

function getBuySellPair(orders, item) {
  const buys = orders
    .filter(
      (order) =>
        !order.completed &&
        order.direction === "buy" &&
        order.itemId === item.id
    )
    .sort(compareBuyOrders);
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
    .sort(compareSellOrders);
  const lowestSell = sells[0];
  if (!lowestSell) {
    return;
  }
  if (highestBuy.price < lowestSell.price) {
    return;
  }
  return [highestBuy, lowestSell];
}

setInterval(async () => {
  const items = await getItems();
  items.forEach(async (item) => {
    while (true) {
      const users = await getUsers();
      const userMap = arrToMap(users);
      const orders = await getOrders();
      const pair = getBuySellPair(orders, item);
      if (!pair) {
        return;
      }
      const [highestBuy, lowestSell] = pair;
      const settledPrice = calculateSettledPrice({
        buyOrder: highestBuy,
        sellOrder: lowestSell,
      });
      const buyer = userMap[highestBuy.userId];
      const seller = userMap[lowestSell.userId];
      if (buyer.numTokens < settledPrice) {
        return;
      }
      const [
        updatedHighestBuy,
        updatedLowestSell,
        transaction,
        updatedBuyer,
        updatedSeller,
      ] = await Promise.all([
        updateOrder(highestBuy.id, [["completed", true]]),
        updateOrder(lowestSell.id, [["completed", true]]),
        insertTransaction({
          buyOrderId: highestBuy.id,
          sellOrderId: lowestSell.id,
        }),
        updateUser(highestBuy.userId, [
          ["num_tokens", buyer.numTokens - settledPrice],
        ]),
        updateUser(lowestSell.userId, [
          ["num_tokens", seller.numTokens + settledPrice],
        ]),
      ]);
      console.log(pair);
      const event = {
        type: "ORDERS_COMPLETED",
        payload: {
          orders: [updatedHighestBuy, updatedLowestSell],
          transaction,
          users: [updatedBuyer, updatedSeller],
        },
      };
      wss.clients.forEach((client) => client.send(JSON.stringify(event)));
      // create user inventory, and move the owned items to other user
      // display wallet and items in user profiles
    }
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
      case "NEW_ORDER": {
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
      case "DELETE_ORDER": {
        const { id } = action.payload;
        const deletedOrder = await deleteOrder(id);
        const event = {
          type: "DELETE_ORDER",
          payload: {
            order: deletedOrder,
          },
        };
        wss.clients.forEach((client) => client.send(JSON.stringify(event)));
        return;
      }
      case "CHANGE_ORDER_PRICE": {
        const { id, price } = action.payload;
        const updatedOrder = await updateOrder(id, [["price", price]]);
        const event = {
          type: "CHANGE_ORDER_PRICE",
          payload: {
            order: updatedOrder,
          },
        };
        wss.clients.forEach((client) => client.send(JSON.stringify(event)));
      }
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
