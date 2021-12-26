import { useParams } from "react-router-dom";
import OrderList from "../OrderList";
import TransactionList from "../TransactionList";

const UserProfile = ({ userMap, allOrders, allTransactions }) => {
  let { userId } = useParams();
  const { name, numTokens } = userMap[userId];
  const orders = allOrders.filter(
    (order) => order.userId === parseInt(userId, 10)
  );
  const transactions = allTransactions.filter(
    (transaction) =>
      transaction.buyOrder.userId === parseInt(userId, 10) ||
      transaction.sellOrder.userId === parseInt(userId, 10)
  );
  return (
    <div>
      <h1>{name}'s Profile</h1>
      <p>Tokens: {numTokens}</p>
      <h2>Orders</h2>
      <OrderList orders={orders} />
      <h2>Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default UserProfile;
