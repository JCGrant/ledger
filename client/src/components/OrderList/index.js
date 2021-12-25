const OrderList = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(({ id, item, user, direction, price, completed }) => (
          <li
            key={id}
            style={{ textDecoration: completed ? "line-through" : "none" }}
          >
            {user.name} is {direction}ing a {item.name} for {price} tokens
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
