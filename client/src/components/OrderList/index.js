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
  localUser,
  onClickDelete,
}) => {
  const wasOrderedByLocalUser = localUser && user.id === localUser.id;
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
        {onClickDelete && !completed && wasOrderedByLocalUser && (
          <button onClick={onClickDelete}>X</button>
        )}
      </span>
    </li>
  );
};

const OrderList = ({ localUser, orders, onClickDeleteOrder }) => {
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
              localUser={localUser}
              onClickDelete={onClickDeleteOrder && onClickDeleteOrder(order)}
            />
          ))}
      </ul>
    </div>
  );
};

export default OrderList;
