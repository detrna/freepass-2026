const pool = require("../config/db");

const Token = {
  insertToken: async (token) => {
    const [result] = await pool.query(
      "INSERT INTO refresh_token (hashed_token, user_id) VALUES (?, ?)",
      [token.value, token.user_id],
    );
    return result;
  },
  updateToken: async (token) => {
    console.log(token);
    const [result] = await pool.query(
      "UPDATE refresh_token SET hashed_token = ?, version = ? WHERE user_id = ?",
      [token.value, token.version, token.user_id],
    );
    return result;
  },
  findByUserid: async (user_id) => {
    const [rows] = await pool.query(
      "SELECT * FROM refresh_token WHERE user_id = ?",
      [user_id],
    );
    return rows[0];
  },
};

module.exports = Token;
