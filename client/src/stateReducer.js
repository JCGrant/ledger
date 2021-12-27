import { compose, curry, flip } from "common/utils";

const addOrders = (state, orders) => ({
  ...state,
  orders: [...orders, ...state.orders],
});

const updateOrder = (state, newOrder) => ({
  ...state,
  orders: state.orders.map((order) =>
    order.id !== newOrder.id
      ? order
      : {
          ...order,
          ...newOrder,
        }
  ),
});

const updateOrders = (state, newOrders) => newOrders.reduce(updateOrder, state);

const deleteOrder = (state, { id }) => ({
  ...state,
  orders: state.orders.filter((order) => order.id !== id),
});

const addTransaction = (state, transaction) => ({
  ...state,
  transactions: [transaction, ...state.transactions],
});

const updateUser = (state, newUser) => ({
  ...state,
  users: state.users.map((user) =>
    user.id !== newUser.id
      ? user
      : {
          ...user,
          ...newUser,
        }
  ),
});

const updateUsers = (state, newUsers) => newUsers.reduce(updateUser, state);

const ordersCompleted = (state, { orders, transaction, users }) =>
  compose(
    curry(flip(updateOrders))(orders),
    curry(flip(addTransaction))(transaction),
    curry(flip(updateUsers))(users)
  )(state);

export function stateReducer(state, action) {
  switch (action.type) {
    case "SEND_STATE":
      return action.payload.state;
    case "NEW_ORDERS":
      return addOrders(state, action.payload.orders);
    case "ORDERS_COMPLETED":
      return ordersCompleted(state, action.payload);
    case "DELETE_ORDER":
      return deleteOrder(state, action.payload.order);
    case "CHANGE_ORDER_PRICE":
      return updateOrder(state, action.payload.order);
    default:
      console.error(`invalid action type: ${action.type}`);
      return state;
  }
}
