const pool = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT u.*, r.version AS token_version FROM user u LEFT JOIN refresh_token r ON u.id = r.user_Id WHERE email = ?",
      [email],
    );
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
    return rows[0];
  },
  createUser: async (user) => {
    const [result] = await pool.query(
      "INSERT INTO user (name, email, hashed_password, role) VALUES (?, ?, ?, ?)",
      [user.name, user.email, user.password, user.role],
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
