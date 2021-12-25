const OrderList = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(({ id, item, user, direction, price }) => (
          <li key={id}>
            {user.name} is {direction}ing a {item.name} for {price} tokens
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
