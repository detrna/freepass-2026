const pool = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT name, email, hashed_password, phone FROM user WHERE id = ?",
      [id],
    );
    return rows[0];
  },
  createUser: async (name, email, password) => {
    const [result] = await pool.query(
      "INSERT INTO user (name, email, hashed_password) VALUES (?, ?, ?)",
      [name, email, password],
    );
    return result;
  },
  updateUser: async (user) => {
    const [result] = await pool.query(
      "UPDATE user SET name = ?, email = ?, hashed_password = ?, phone = ? WHERE id = ?",
      [user.name, user.email, user.password, user.phone, user.id],
    );
    return result;
  },
  deleteUser: async (id) => {
    const [result] = await pool.query("DELETE FROM user WHERE id = ?", [id]);
    return result;
  },
};

module.exports = User;
