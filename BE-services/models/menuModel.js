const pool = require("../config/db");

const Menu = {
  createMenu: async (menu) => {
    const [result] = pool.query(
      "INSERT INTO menu (name, price, stock, canteen_id) VALUES (?, ?, ?, ?)",
      [menu.name, menu.price, menu.stock, menu.canteen_id],
    );
    return result;
  },
};

module.exports = Menu;
