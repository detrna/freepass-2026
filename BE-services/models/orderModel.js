const pool = require("../config/db");

const Order = {
  createOrder: async (menu_id, user_id) => {
    const [result] = await pool.query(
      "INSERT INTO orders (menu_id, user_id) VALUES (?, ?)",
      [menu_id, user_id],
    );
    return result;
  },
  viewIncomingOrders: async (id) => {
    const [rows] = await pool.query(
      "SELECT o.*, m.name AS menu_name, u.name AS customer_name FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id INNER JOIN orders o ON m.id = o.menu_id INNER JOIN user u ON o.user_id = u.id WHERE c.id = ?",
      [id],
    );
    return rows;
  },
};

module.exports = Order;
