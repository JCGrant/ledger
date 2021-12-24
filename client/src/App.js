import { useEffect } from "react";
import CreateOrder from "./components/CreateOrder";

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
    <div>
      <CreateOrder options={itemOptions} onCreateOrder={onCreateOrder} />
    </div>
  );
}

export default App;
