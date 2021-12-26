import { useParams } from "react-router-dom";
import OrderList from "../OrderList";

const UserProfile = ({ userMap, allOrders }) => {
  let { userId } = useParams();
  const { name, numTokens } = userMap[userId];
  const orders = allOrders.filter(
    (order) => order.userId === parseInt(userId, 10)
  );
  return (
    <div>
      <h1>{name}'s Profile</h1>
      <p>Tokens: {numTokens}</p>
      <OrderList orders={orders} />
    </div>
  );
};

export default UserProfile;
