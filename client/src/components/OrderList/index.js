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
  onClickDelete,
}) => {
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
        <Link to={`/users/${user.id}`}>{user.name}</Link> is {direction}ing a{" "}
        <Link to={`/items/${item.id}`}>{item.name}</Link> for {price} tokens{" "}
      </span>
      {onClickDelete && <button onClick={onClickDelete}>X</button>}
    </li>
  );
};

const OrderList = ({ orders, onClickDeleteOrder }) => {
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
            />
          ))}
      </ul>
    </div>
  );
};

export default OrderList;
