import { useState } from "react";

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
  const wasOrderedByLocalUser = user.id === localUser.id;
  return (
    <li
      key={id}
      style={{
        color: direction === "buy" ? "green" : "red",
        textDecoration: completed ? "line-through" : "none",
      }}
    >
      {user.name} is {direction}ing a {item.name} for {price} tokens{" "}
      {!completed && wasOrderedByLocalUser && (
        <button onClick={onClickDelete}>X</button>
      )}
    </li>
  );
};

const OrderList = ({ localUser, orders, onClickDeleteOrder }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = () => {
    setShowCompleted((showCompleted) => !showCompleted);
  };
  return (
    <div>
      <h1>Orders</h1>
      <button onClick={toggleShowCompleted}>
        {showCompleted ? "Hide" : "Show"} completed Orders
      </button>
      <ul>
        {orders
          .filter((order) => (showCompleted ? true : !order.completed))
          .map((order) => (
            <Order
              key={order.id}
              {...order}
              localUser={localUser}
              onClickDelete={onClickDeleteOrder(order)}
            />
          ))}
      </ul>
    </div>
  );
};

export default OrderList;
