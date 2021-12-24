import { useEffect, useRef, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderList from "./components/OrderList";
import { BACKEND_HOST } from "./config.js";

const itemOptions = [
  { value: "chocolate-nut-bar", label: "Chocolate Nut Bar" },
  { value: "jaffa-cakes", label: "Jaffa Cake" },
  { value: "lindt-small-ball", label: "Lindt Small Ball" },
];

function App() {
  const ws = useRef(new WebSocket(`ws://${BACKEND_HOST}:3001/ws`));
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    setOrders([order, ...orders]);
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
        setOrders(event.payload.state.orders);
        return;
      case "NEW_ORDER":
        addOrder(event.payload.order);
        return;
      default:
        return;
    }
  };

  const onCreateOrder = (order) => {
    send({
      type: "NEW_ORDER",
      payload: {
        order,
      },
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/orders/new"
          element={
            <CreateOrder options={itemOptions} onCreateOrder={onCreateOrder} />
          }
        />
        <Route path="/orders" element={<OrderList orders={orders} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
