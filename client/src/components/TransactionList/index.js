const Transaction = ({ id, sellOrder, buyOrder, timestamp }) => {
  const date = new Date(timestamp);
  const itemName = sellOrder.item.name;
  const sellerName = sellOrder.user.name;
  const buyerName = buyOrder.user.name;
  const settledPrice = Math.floor((buyOrder.price + sellOrder.price) / 2);
  return (
    <li key={id}>
      {itemName}: {sellerName} {"->"} {buyerName}, for {settledPrice} tokens, at{" "}
      {date.toLocaleTimeString()}
    </li>
  );
};

const TransactionList = ({ transactions }) => {
  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} {...transaction} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
