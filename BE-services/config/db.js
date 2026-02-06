const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  password: "",
  host: "localhost",
  database: "bcc_canteen_dzaki",
  connectionLimit: 10,
});

module.exports = pool;
