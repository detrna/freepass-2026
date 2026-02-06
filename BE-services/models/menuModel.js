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
      "UPDATE menu SET name = ?, price = ?, stock = ? WHERE id = ?",
      [menu.name, menu.price, menu.stock, menu.id],
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
  decreaseStock: async (id) => {
    const [result] = await pool.query(
      "UPDATE menu SET stock = stock - 1 WHERE id = ?",
      [id],
    );
    return result;
  },
  increaseStock: async (id) => {
    const [result] = await pool.query(
      "UPDATE menu SET stock = stock + 1 WHERE id = ?",
      [id],
    );
    return result;
  },
  viewMenus: async (canteen_id) => {
    const [rows] = await pool.query("SELECT * FROM menu WHERE canteen_id = ?", [
      canteen_id,
    ]);
    return rows;
  },
};

module.exports = Menu;
