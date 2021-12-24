import { useEffect, useRef } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const itemOptions = [
  { value: "chocolate-nut-bar", label: "Chocolate Nut Bar" },
  { value: "jaffa-cakes", label: "Jaffa Cake" },
  { value: "lindt-small-ball", label: "Lindt Small Ball" },
];

function App() {
  const ws = useRef(new WebSocket("ws://localhost:3001/ws"));
  useEffect(() => {
    ws.current.onmessage = ({ data }) => {
      const event = JSON.parse(data);
      console.log(event);
    };
  });

  const send = (action) => {
    ws.current.send(JSON.stringify(action));
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
