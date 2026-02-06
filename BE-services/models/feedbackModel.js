const pool = require("../config/db");

const Feedback = {
  createFeedback: async (feedback) => {
    const [result] = await pool.query(
      "INSERT INTO feedback (content, order_id, user_id, canteen_id) VALUES (?, ?, ?, ?)",
      [
        feedback.content,
        feedback.order_id,
        feedback.user_id,
        feedback.canteen_id,
      ],
    );
    return result;
  },
  findExistingOrder: async (order_id, user_id) => {
    const [rows] = await pool.query(
      "SELECT * FROM feedback WHERE order_id = ? AND user_id = ?",
      [order_id, user_id],
    );
    return rows[0];
  },
  findByUserId: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM feedback WHERE user_id = ?",
      [id],
    );
    return rows;
  },
  findByCanteenId: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM feedback WHERE canteen_id = ?",
      [id],
    );
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM feedback WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },
  deleteFeedback: async (id) => {
    const [result] = await pool.query("DELETE FROM feedback WHERE id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Feedback;
