import { calculateSettledPrice } from "common";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

const Order = ({
  id,
  item,
  user,
  direction,
  price,
  completed,
  timestamp,
  onClickDelete,
  allTransactions,
}) => {
  const date = new Date(timestamp);
  const transactions = allTransactions.filter(
    (transaction) => transaction.buyOrder.itemId === item.id
  );
  const lastTransaction = transactions[0];
  const marketPrice = lastTransaction && calculateSettledPrice(lastTransaction);
  const percentageDifference = ((price - marketPrice) / marketPrice) * 100 || 0;
  return (
    <li
      className="order-item"
      key={id}
      style={{
        color: direction === "buy" ? "green" : "red",
        textDecoration: completed ? "line-through" : "none",
      }}
    >
      <span>
        {date.toLocaleTimeString()}:{" "}
        <Link to={`/users/${user.id}`}>{user.name}</Link> is {direction}ing a{" "}
        <Link to={`/items/${item.id}`}>{item.name}</Link> for {price} tokens (
        {percentageDifference >= 0 ? "⬆" : "⬇"}
        {Math.abs(percentageDifference.toFixed(0))}%)
      </span>
      {onClickDelete && <button onClick={onClickDelete}>X</button>}
    </li>
  );
};

const OrderList = ({ orders, onClickDeleteOrder, allTransactions }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = () => {
    setShowCompleted((showCompleted) => !showCompleted);
  };
  return (
    <div className="order-list container">
      <button onClick={toggleShowCompleted}>
        {showCompleted ? "Hide" : "Show"} completed Orders
      </button>
      <ul className="order-list-wrapper">
        {orders
          .filter((order) => (showCompleted ? true : !order.completed))
          .map((order) => (
            <Order
              key={order.id}
              {...order}
              onClickDelete={onClickDeleteOrder && onClickDeleteOrder(order)}
              allTransactions={allTransactions}
            />
          ))}
      </ul>
    </div>
  );
};

export default OrderList;
