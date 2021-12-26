import { useParams } from "react-router-dom";
import OrderList from "../OrderList";
import TransactionList from "../TransactionList";

const ItemPage = ({ itemMap, allOrders, allTransactions }) => {
  const { itemId } = useParams();
  const { name } = itemMap[itemId];
  const orders = allOrders.filter(
    (order) => order.itemId === parseInt(itemId, 10)
  );
  const transactions = allTransactions.filter(
    (transaction) => transaction.buyOrder.itemId === parseInt(itemId, 10)
  );
  return (
    <div>
      <h1>{name}</h1>
      <h2>Orders</h2>
      <OrderList orders={orders} />
      <h2>Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default ItemPage;
