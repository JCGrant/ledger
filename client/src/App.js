import { useEffect, useRef, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderList from "./components/OrderList";
import { BACKEND_HOST } from "./config.js";

function arrToMap(array) {
  return array.reduce(
    (acc, object) => ({
      ...acc,
      [object.id]: object,
    }),
    {}
  );
}

function App() {
  const ws = useRef(new WebSocket(`ws://${BACKEND_HOST}:3001/ws`));
  const [state, setState] = useState({
    orders: [],
    users: [],
    items: [],
  });
  const [userId, setUserId] = useState(5); // temp manual id

  const addOrders = (orders) => {
    setState({
      ...state,
      orders: [...orders, ...state.orders],
    });
  };

  useEffect(() => {
    ws.current.onmessage = ({ data }) => {
      const event = JSON.parse(data);
      handleEvent(event);
    };
  });

  const send = (action) => {
    ws.current.send(JSON.stringify(action));
  };

  const handleEvent = (event) => {
    console.log(event);
    switch (event.type) {
      case "SEND_STATE":
        setState(event.payload.state);
        return;
      case "NEW_ORDERS":
        addOrders(event.payload.orders);
        return;
      default:
        return;
    }
  };

  const onCreateOrder = (order) => {
    send({
      type: "NEW_ORDER",
      payload: {
        order: { ...order, userId },
      },
    });
  };

  const userMap = arrToMap(state.users);
  const itemMap = arrToMap(state.items);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/orders/new"
          element={
            <CreateOrder items={state.items} onCreateOrder={onCreateOrder} />
          }
        />
        <Route
          path="/orders"
          element={
            <OrderList
              orders={state.orders.map((order) => ({
                ...order,
                user: userMap[order.userId],
                item: itemMap[order.itemId],
              }))}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
