import pg from "pg";
const { Pool } = pg;

const pool = new Pool();

function convertUser(dbUser) {
  return {
    id: dbUser.id,
    name: dbUser.name,
    numTokens: dbUser.num_tokens,
  };
}

export async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows.map(convertUser);
}

export async function insertUser({ name }) {
  const result = await pool.query(
    "INSERT INTO users(name, num_tokens) VALUES($1, $2) RETURNING *",
    [name, 1000]
  );
  return convertUser(result.rows[0]);
}

function convertItem(dbItem) {
  return {
    id: dbItem.id,
    name: dbItem.name,
  };
}

export async function getItems() {
  const result = await pool.query("SELECT * FROM items");
  return result.rows.map(convertItem);
}

export async function insertItem({ name }) {
  const result = await pool.query(
    "INSERT INTO items(name) VALUES($1) RETURNING *",
    [name]
  );
  return convertItem(result.rows[0]);
}

function convertOrder(dbOrder) {
  return {
    id: dbOrder.id,
    itemId: dbOrder.item_id,
    userId: dbOrder.user_id,
    price: dbOrder.price,
    direction: dbOrder.direction,
    timestamp: dbOrder.timestamp,
    completed: dbOrder.completed,
  };
}

export async function getOrders() {
  const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
  return result.rows.map(convertOrder);
}

export async function insertOrder({ itemId, userId, price, direction }) {
  const timestamp = Date.now();
  const completed = false;
  const result = await pool.query(
    "INSERT INTO orders(item_id, user_id, price, direction, timestamp, completed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [itemId, userId, price, direction, timestamp, completed]
  );
  return convertOrder(result.rows[0]);
}

export async function updateOrder(id, values) {
  const sqlValues = values
    .map(([column, value]) => `${column} = ${value}`)
    .join(", ");
  const result = await pool.query(
    `UPDATE orders SET ${sqlValues} WHERE id = ${id} RETURNING *`
  );
  return convertOrder(result.rows[0]);
}

export async function insertOrders(order, amount) {
  return await Promise.all(
    Array.from({ length: amount }).map(() => insertOrder(order))
  );
}

export async function getState() {
  const [users, items, orders] = await Promise.all([
    getUsers(),
    getItems(),
    getOrders(),
  ]);
  return {
    users,
    items,
    orders,
  };
}
