const OrderList = ({ orders }) => {
  return (
    <ul>
      {orders.map(
        ({ selectedItem, direction, requestedAmount, requestedPrice }, i) => (
          <li key={i}>
            {selectedItem} - {direction} - {requestedAmount} Amount -{" "}
            {requestedPrice} Price
          </li>
        )
      )}
    </ul>
  );
};

export default OrderList;
