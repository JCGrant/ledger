import { useEffect, useRef, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import OrderList from "./components/OrderList";
import { BACKEND_HOST } from "./config.js";
import Home from "./components/Home";
import Login from "./components/Login";
import TransactionList from "./components/TransactionList";
import { arrToMap } from "common/utils";
import UserProfile from "./components/UserProfile";

function App() {
  const ws = useRef(new WebSocket(`ws://${BACKEND_HOST}:3001/ws`));
  const [state, setState] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      return;
    }
    setUserId(storedUserId);
  }, []);

  const addOrders = (orders) => {
    setState((state) => ({
      ...state,
      orders: [...orders, ...state.orders],
    }));
  };

  const updateOrder = (id, newState) => {
    setState((state) => ({
      ...state,
      orders: state.orders.map((order) =>
        order.id !== id
          ? order
          : {
              ...order,
              ...newState,
            }
      ),
    }));
  };

  const addTransaction = (transaction) => {
    setState((state) => ({
      ...state,
      transactions: [transaction, ...state.transactions],
    }));
  };

  const updateUser = (id, newState) => {
    setState((state) => ({
      ...state,
      users: state.users.map((user) =>
        user.id !== id
          ? user
          : {
              ...user,
              ...newState,
            }
      ),
    }));
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
      case "ORDERS_COMPLETED":
        event.payload.orders.forEach((order) => updateOrder(order.id, order));
        addTransaction(event.payload.transaction);
        event.payload.users.forEach((user) => updateUser(user.id, user));
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

  const onLogin = (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  if (!state) {
    return <div>loading...</div>;
  }
  const { users, items } = state;
  const userMap = arrToMap(users);
  const itemMap = arrToMap(items);
  const orders = state.orders.map((order) => ({
    ...order,
    user: userMap[order.userId],
    item: itemMap[order.itemId],
  }));
  const orderMap = arrToMap(orders);
  const localUser = userMap[userId];
  const transactions = state.transactions.map((transaction) => ({
    ...transaction,
    buyOrder: orderMap[transaction.buyOrderId],
    sellOrder: orderMap[transaction.sellOrderId],
  }));
  if (userId === undefined) {
    return <Login users={state.users} onLogin={onLogin} />;
  }
  return (
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link>
      </div>
      <Routes>
        <Route
          path="/orders/new"
          element={
            <CreateOrder
              user={localUser}
              items={items}
              onCreateOrder={onCreateOrder}
            />
          }
        />
        <Route path="/orders" element={<OrderList orders={orders} />} />
        <Route
          path="/transactions"
          element={<TransactionList transactions={transactions} />}
        />
        <Route
          path="/users/:userId"
          element={<UserProfile userMap={userMap} />}
        />
        <Route path="/" element={<Home user={localUser} users={users} />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
