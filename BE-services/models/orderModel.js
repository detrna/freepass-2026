const pool = require("../config/db");

const Order = {
  createOrder: async (order) => {
    const [result] = await pool.query(
      "INSERT INTO orders (quantity, amount, menu_id, user_id) VALUES (?, ?, ?, ?)",
      [order.quantity, order.amount, order.menu_id, order.user_id],
    );
    return result;
  },
  getOrdersByCanteenId: async (id) => {
    const [rows] = await pool.query(
      "SELECT o.*, c.id AS canteen_id, c.name AS canteen_name, m.id AS menu_id, m.name AS menu_name, u.id AS customer_id, u.name AS customer_name FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id INNER JOIN orders o ON m.id = o.menu_id INNER JOIN user u ON o.user_id = u.id WHERE c.id = ?",
      [id],
    );
    return rows;
  },
  getOrdersByUserId: async (id) => {
    const [rows] = await pool.query(
      "SELECT o.*, c.id AS canteen_id, c.name AS canteen_name, m.id AS menu_id, m.name AS menu_name, u.id AS customer_id, u.name AS customer_name FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id INNER JOIN orders o ON m.id = o.menu_id INNER JOIN user u ON o.user_id = u.id WHERE u.id = ?",
      [id],
    );
    return rows;
  },
  cancelOrder: async (id) => {
    const [result] = await pool.query(
      "UPDATE orders SET progress_status = ? WHERE id = ?",
      ["cancelled", id],
    );
    return result;
  },
  deleteOrder: async (id) => {
    const [result] = await pool.query("DELETE FROM orders WHERE id = ?", [id]);
    return result;
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    return rows[0];
  },
};

module.exports = Order;
