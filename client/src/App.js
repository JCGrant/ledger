import { useEffect, useReducer, useRef, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import OrderList from "./components/OrderList";
import { BACKEND_HOST } from "./config.js";
import Home from "./components/Home";
import Login from "./components/Login";
import TransactionList from "./components/TransactionList";
import { arrToMap } from "common/utils";
import UserProfile from "./components/UserProfile";
import "./App.styles.scss";
import ItemPage from "./components/ItemPage";
import { stateReducer } from "./stateReducer";

function App() {
  const ws = useRef(new WebSocket(`ws://${BACKEND_HOST}/ws`));
  const [state, dispatch] = useReducer(stateReducer, undefined);
  const [localUserId, setLocalUserId] = useState(undefined);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      return;
    }
    setLocalUserId(parseInt(storedUserId, 10));
  }, []);

  useEffect(() => {
    ws.current.onmessage = ({ data }) => {
      const event = JSON.parse(data);
      console.log(event);
      dispatch(event);
    };
  }, []);

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
  const localUser = userMap[localUserId];
  const transactions = state.transactions.map((transaction) => ({
    ...transaction,
    buyOrder: orderMap[transaction.buyOrderId],
    sellOrder: orderMap[transaction.sellOrderId],
  }));

  const send = (action) => {
    ws.current.send(JSON.stringify(action));
  };

  const onCreateOrder = (order) => {
    send({
      type: "NEW_ORDER",
      payload: {
        order: { ...order, userId: localUserId },
      },
    });
  };

  const onClickDeleteOrder = ({ id, userId }) => {
    if (userId !== localUserId) {
      return undefined;
    }
    return () => {
      send({
        type: "DELETE_ORDER",
        payload: {
          id,
        },
      });
    };
  };

  const onLogin = (userId) => {
    setLocalUserId(userId);
    localStorage.setItem("userId", userId);
  };

  if (!localUserId) {
    return <Login users={users} onLogin={onLogin} />;
  }
  return (
    <BrowserRouter>
      <div className="space-lg">
        <header className="header">
          <nav className="navigation">
            <Link to="/">Home</Link>
            <Link to="/orders/new">Create Order</Link>
            <Link to="/orders">View All Orders</Link>
            <Link to="/transactions">View All Transactions</Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route
              path="/orders/new"
              element={
                <CreateOrder
                  user={localUser}
                  items={items}
                  onCreateOrder={onCreateOrder}
                  allTransactions={transactions}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <div>
                  <h1>Orders</h1>
                  <OrderList
                    orders={orders}
                    onClickDeleteOrder={onClickDeleteOrder}
                    allTransactions={transactions}
                    onCreateOrder={onCreateOrder}
                  />
                </div>
              }
            />
            <Route
              path="/transactions"
              element={
                <div>
                  <h1>Transactions</h1>
                  <TransactionList transactions={transactions} />
                </div>
              }
            />
            <Route
              path="/users/:userId"
              element={
                <UserProfile
                  userMap={userMap}
                  allOrders={orders}
                  allTransactions={transactions}
                  onClickDeleteOrder={onClickDeleteOrder}
                />
              }
            />
            <Route
              path="/items/:itemId"
              element={
                <ItemPage
                  itemMap={itemMap}
                  allOrders={orders}
                  allTransactions={transactions}
                  onClickDeleteOrder={onClickDeleteOrder}
                />
              }
            />
            <Route path="/" element={<Home user={localUser} users={users} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
