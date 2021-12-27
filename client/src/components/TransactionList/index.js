import { calculateSettledPrice } from "common";
import { Link } from "react-router-dom";
import "./styles.scss";

const Transaction = ({ id, sellOrder, buyOrder, timestamp }) => {
  const date = new Date(timestamp);
  const item = sellOrder.item;
  const seller = sellOrder.user;
  const buyer = buyOrder.user;
  const settledPrice = calculateSettledPrice({ buyOrder, sellOrder });
  return (
    <tr className="transaction" key={id}>
      <td>
        <Link to={`/items/${item.id}`}>{item.name}</Link>
      </td>
      <td>
        <Link to={`/users/${seller.id}`}>{seller.name}</Link>
      </td>
      <td>
        <Link to={`/users/${buyer.id}`}>{buyer.name}</Link>
      </td>
      <td>{settledPrice}</td>
      <td>{date.toLocaleTimeString()}</td>
    </tr>
  );
};

const TransactionList = ({ transactions }) => {
  return (
    <div className="transactions container">
      <table className="transactions-wrapper">
        <thead>
          <tr>
            <th>Item</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Price</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <Transaction key={transaction.id} {...transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
