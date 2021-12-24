import { useEffect } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const itemOptions = [
  { value: "chocolate-nut-bar", label: "Chocolate Nut Bar" },
  { value: "jaffa-cakes", label: "Jaffa Cake" },
  { value: "lindt-small-ball", label: "Lindt Small Ball" },
];

function App() {
  const onCreateOrder = (order) => {
    console.log(order);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/ws");
  }, []);

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
