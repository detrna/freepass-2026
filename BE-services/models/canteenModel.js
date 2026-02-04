const pool = require("../config/db");

const Canteen = {
  getCanteenListing: async () => {
    const [rows] = await pool.query(
      "SELECT c.id as canteenId, c.name AS canteenName, m.* FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id",
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
};

module.exports = Canteen;
