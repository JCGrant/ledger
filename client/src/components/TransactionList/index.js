import "./styles.scss";

const Transaction = ({ id, sellOrder, buyOrder, timestamp }) => {
  const date = new Date(timestamp);
  const itemName = sellOrder.item.name;
  const sellerName = sellOrder.user.name;
  const buyerName = buyOrder.user.name;
  const settledPrice = (buyOrder.price + sellOrder.price) / 2;
  return (
    <tr className="transaction" key={id}>
      <td>{itemName}</td>
      <td>{sellerName}</td>
      <td>{buyerName}</td>
      <td>{settledPrice}</td>
      <td>{date.toLocaleTimeString()}</td>
    </tr>
  );
};

const TransactionList = ({ transactions }) => {
  return (
    <div className="transactions container">
      <h1>Transactions</h1>
      <table className="transactions-wrapper">
        <tr>
          <th>Item</th>
          <th>Seller</th>
          <th>Buyer</th>
          <th>Price</th>
          <th>Time</th>
        </tr>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} {...transaction} />
        ))}
      </table>
    </div>
  );
};

export default TransactionList;
