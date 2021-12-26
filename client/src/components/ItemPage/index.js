import { useParams } from "react-router-dom";
import OrderList from "../OrderList";

const ItemPage = ({ itemMap, allOrders }) => {
  const { itemId } = useParams();
  const { name } = itemMap[itemId];
  const orders = allOrders.filter(
    (order) => order.itemId === parseInt(itemId, 10)
  );
  return (
    <div>
      <h1>Orders for {name}</h1>
      <OrderList orders={orders} />
    </div>
  );
};

export default ItemPage;
