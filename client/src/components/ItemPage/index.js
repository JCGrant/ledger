import { useParams } from "react-router-dom";
import OrderList from "../OrderList";
import TransactionList from "../TransactionList";

const ItemPage = ({
  itemMap,
  allOrders,
  allTransactions,
  onClickDeleteOrder,
}) => {
  const { itemId: itemIdStr } = useParams();
  const itemId = parseInt(itemIdStr, 10);
  const { name } = itemMap[itemId];
  const orders = allOrders.filter((order) => order.itemId === itemId);
  const transactions = allTransactions.filter(
    (transaction) => transaction.buyOrder.itemId === itemId
  );
  return (
    <div>
      <h1>{name}</h1>
      <h2>Orders</h2>
      <OrderList orders={orders} onClickDeleteOrder={onClickDeleteOrder} />
      <h2>Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default ItemPage;
