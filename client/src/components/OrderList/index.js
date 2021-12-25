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
      className="order-item"
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
  return (
    <div className="order-list container">
      <h1>Orders</h1>
      <ul className="order-list-wrapper">
        {orders.map((order) => (
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
