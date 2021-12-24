const OrderList = ({ orders }) => {
  return (
    <ul>
      {orders.map(({ id, item, user, direction, price }) => (
        <li key={id}>
          {user.name} is {direction}ing a {item.name} for {price} tokens
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
