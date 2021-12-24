import pg from "pg";
const { Pool } = pg;

const pool = new Pool();

export async function insertUser({ name }) {
  const result = await pool.query(
    "INSERT INTO users(name, num_tokens) VALUES($1, $2) RETURNING *",
    [name, 1000]
  );
  const user = result.rows[0];
  return {
    id: user.id,
    name: user.name,
    numTokens: user.num_tokens,
  };
}

export async function insertItem({ name }) {
  const result = await pool.query(
    "INSERT INTO items(name) VALUES($1) RETURNING *",
    [name]
  );
  const item = result.rows[0];
  return {
    id: item.id,
    name: item.name,
  };
}

export async function insertOrder({ itemId, userId, price, direction }) {
  const result = await pool.query(
    "INSERT INTO orders(item_id, user_id, price, direction) VALUES($1, $2, $3, $4) RETURNING *",
    [itemId, userId, price, direction]
  );
  const order = result.rows[0];
  return {
    id: order.id,
    itemId: order.item_id,
    userId: order.user_id,
    price: order.price,
    direction: order.direction.trim(),
  };
}

export async function insertOrders(order, amount) {
  return await Promise.all(
    Array.from({ length: amount }).map(() => insertOrder(order))
  );
}

export async function getState() {
  const usersPromise = pool.query("SELECT * FROM users");
  const itemsPromise = pool.query("SELECT * FROM items");
  const ordersPromise = pool.query("SELECT * FROM orders ORDER BY id DESC");
  return {
    users: (await usersPromise).rows,
    items: (await itemsPromise).rows,
    orders: (await ordersPromise).rows.map((order) => ({
      id: order.id,
      itemId: order.item_id,
      userId: order.user_id,
      price: order.price,
      direction: order.direction.trim(),
    })),
  };
}
