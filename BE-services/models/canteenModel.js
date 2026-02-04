const pool = require("../config/db");

const Canteen = {
  getCanteenListing: async () => {
    const [rows] = await pool.query(
      "SELECT c.*, m.id AS menu_id, m.name AS menu_name, m.price AS menu_price, m.stock AS menu_stock, m.canteen_id AS menu_canteen_id FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id",
    );
    return rows;
  },
  findByUserId: async (id) => {
    const [rows] = await pool.query(
      "SELECT id FROM canteen WHERE user_id = ?",
      [id],
    );
    return rows[0];
  },
  findByMenuId: async (id) => {
    const [rows] = await pool.query(
      "SELECT c.* FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id WHERE m.id = ?",
      [id],
    );
    return rows[0];
  },
  createCanteen: async (canteen) => {
    const [result] = await pool.query(
      "INSERT INTO canteen (name, phone, user_id) VALUES (?, ?, ?)",
      [canteen.name, canteen.phone, canteen.user_id],
    );
    return result;
  },
  updateCanteen: async (canteen) => {
    const [result] = await pool.query(
      "UPDATE canteen SET name = ?, phone = ?, user_id = ?",
      [canteen.name, canteen.phone, canteen.user_id],
    );
    return result;
  },
};

module.exports = Canteen;
