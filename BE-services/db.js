const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  password: "",
  host: "localhost",
  database: "bcc_canteen",
  connectionLimit: 10,
});

/*
pool.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("db connected");
});
*/

module.exports = pool;
