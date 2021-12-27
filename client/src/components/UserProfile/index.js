import { useParams } from "react-router-dom";
import OrderList from "../OrderList";
import TransactionList from "../TransactionList";

const UserProfile = ({
  userMap,
  allOrders,
  allTransactions,
  onClickDeleteOrder,
  onCreateOrder,
  onChangeOrderPrice,
}) => {
  const { userId: userIdStr } = useParams();
  const userId = parseInt(userIdStr, 10);
  const { name, numTokens } = userMap[userId];
  const orders = allOrders.filter((order) => order.userId === userId);
  const transactions = allTransactions.filter(
    (transaction) =>
      transaction.buyOrder.userId === userId ||
      transaction.sellOrder.userId === userId
  );
  return (
    <div>
      <h1>{name}'s Profile</h1>
      <p>Tokens: {numTokens}</p>
      <h2>Orders</h2>
      <OrderList
        orders={orders}
        onClickDeleteOrder={onClickDeleteOrder}
        allTransactions={allTransactions}
        onCreateOrder={onCreateOrder}
        onChangeOrderPrice={onChangeOrderPrice}
      />
      <h2>Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default UserProfile;
