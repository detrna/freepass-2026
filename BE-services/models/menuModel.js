const pool = require("../config/db");

const Menu = {
  createMenu: async (menu) => {
    const [result] = await pool.query(
      "INSERT INTO menu (name, price, stock, canteen_id) VALUES (?, ?, ?, ?)",
      [menu.name, menu.price, menu.stock, menu.canteen_id],
    );
    return result;
  },
  updateMenu: async (menu) => {
    const [result] = await pool.query(
      "UPDATE menu SET name = ?, price = ?, stock = ?",
      [menu.name, menu.price, menu.stock],
    );
    return result;
  },
  deleteMenu: async (menu) => {
    const [result] = await pool.query("DELETE FROM menu WHERE id = ?", [
      menu.id,
    ]);
    return result;
  },
  findMenuById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM menu WHERE id = ?", [id]);
    return rows[0];
  },
};

module.exports = Menu;
