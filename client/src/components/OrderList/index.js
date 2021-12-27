import { calculateSettledPrice } from "common";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

const CreateOrderInlign = ({
  item,
  onCreateOrder,
  defaultDirection,
  defaultPrice,
}) => {
  const [direction, setDirection] = useState(defaultDirection);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(defaultPrice);

  const onChangeDirection = (e) => {
    setDirection(e.target.value);
  };

  const onChangeRequestedAmount = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setAmount(value);
  };

  const onChangeRequestedPrice = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setPrice(value);
  };

  const onSubmitButton = () => {
    if (amount === undefined || amount === 0) {
      return;
    }
    if (price === undefined || price === 0) {
      return;
    }
    onCreateOrder({
      itemId: item.id,
      direction,
      amount,
      price,
    });
    setDirection(defaultDirection);
    setAmount(1);
    setPrice(defaultPrice);
  };

  return (
    <span>
      <span>
        <select value={direction} onChange={onChangeDirection}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </span>
      <span>
        <label>
          Amount:{" "}
          <input
            value={amount ?? ""}
            onChange={onChangeRequestedAmount}
            type="number"
          />
        </label>
        <label>
          Price:{" "}
          <input
            value={price ?? ""}
            onChange={onChangeRequestedPrice}
            type="number"
          />
        </label>
      </span>
      <span>
        <button onClick={onSubmitButton}>Submit</button>
      </span>
    </span>
  );
};

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
  onCreateOrder,
  onChangePrice,
}) => {
  const date = new Date(timestamp);
  const transactions = allTransactions.filter(
    (transaction) => transaction.buyOrder.itemId === item.id
  );
  const lastTransaction = transactions[0];
  const marketPrice = lastTransaction && calculateSettledPrice(lastTransaction);
  const percentageDifference = ((price - marketPrice) / marketPrice) * 100 || 0;
  const differenceSymbol = percentageDifference >= 0 ? "⬆" : "⬇";
  const renderedPercentageDifference = marketPrice
    ? Math.abs(percentageDifference.toFixed(0))
    : "?";

  const onChangePriceInput = (e) => {
    const valueStr = e.target.value;
    if (valueStr === "") {
      return;
    }
    const value = parseInt(valueStr, 10);
    onChangePrice(value);
  };

  return (
    <li
      className="order-item"
      key={id}
      style={{
        color: direction === "buy" ? "green" : "red",
        textDecoration: completed ? "line-through" : "none",
      }}
    >
      <span className="order-column">
        {date.toLocaleTimeString()}:{" "}
        <Link to={`/users/${user.id}`}>{user.name}</Link> is {direction}ing a{" "}
        <Link to={`/items/${item.id}`}>{item.name}</Link> for{" "}
        {onChangePrice ? (
          <input value={price} onChange={onChangePriceInput} type="number" />
        ) : (
          price
        )}{" "}
        tokens. ({differenceSymbol}
        {renderedPercentageDifference}%, MP: {marketPrice ?? "?"})
      </span>
      {!completed && (
        <span className="order-column">
          <CreateOrderInlign
            item={item}
            onCreateOrder={onCreateOrder}
            defaultDirection={direction === "buy" ? "sell" : "buy"}
            defaultPrice={price}
          />
          {onClickDelete && (
            <button
              className="delete-button"
              style={{ marginLeft: 50 }}
              onClick={onClickDelete}
            >
              X
            </button>
          )}
        </span>
      )}
    </li>
  );
};

const OrderList = ({
  orders,
  onClickDeleteOrder,
  allTransactions,
  onCreateOrder,
  onChangeOrderPrice,
}) => {
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
              onClickDelete={onClickDeleteOrder(order)}
              allTransactions={allTransactions}
              onCreateOrder={onCreateOrder}
              onChangePrice={onChangeOrderPrice(order)}
            />
          ))}
      </ul>
    </div>
  );
};

export default OrderList;
