const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const validator = require("validator");
const pool = require("./db.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
const bcryptSalt = 10;
const accessTokenExpiry = { expiresIn: "5m" };
const refreshTokenExpiry = { expiresIn: "15m" };
const cookieConfig = { sameSite: "lax", secure: true, httpOnly: true };

//user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password didn't match" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Email was invalid" });

    const [existingUser] = await pool.query(
      "SELECT id FROM user WHERE email = ?",
      [email],
    );

    if (existingUser.length !== 0)
      return res.status(400).json({ message: "Email was already taken" });

    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

    const [postUser] = await pool.query(
      "INSERT INTO user (name, email, hashed_password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    const payload = {
      message: "Account succesfully registered",
      displayedMessage: `Account successfully registered by the name of ${name} and saved email by ${email}`,
    };

    if (role) return res.status(201).json(payload);

    const jwtPayload = {
      id: postUser.insertId,
      name: name,
      role: "student",
    };

    const accessToken = jwt.sign(
      jwtPayload,
      process.env.JWT_ACCESS_KEY,
      accessTokenExpiry,
    );
    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.JWT_REFRESH_KEY,
      refreshTokenExpiry,
    );

    res.cookie("refresh_token", refreshToken, cookieConfig);
    res.cookie("access_token", accessToken, cookieConfig);

    res.send(201).json(payload);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).json({ error: err.name });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    "SELECT id, name, hashed_password, role FROM user WHERE email = ?",
    [email],
  );

  console.log(rows);

  if (rows.length === 0)
    return res.status(401).json({ message: "Incorrect email or password" });

  const isMatch = await bcrypt.compare(password, rows[0].hashed_password);

  if (!isMatch)
    return res.status(401).json({ message: "Incorrect email or password" });

  const jwtPayload = {
    id: rows[0].id,
    name: rows[0].name,
    role: rows[0].role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_KEY,
    accessTokenExpiry,
  );
  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.JWT_REFRESH_KEY,
    refreshTokenExpiry,
  );

  res.cookie("refresh_token", refreshToken, cookieConfig);
  res.cookie("access_token", accessToken, cookieConfig);

  res.json({ message: "Successfully logged in" });
});

app.listen(3001, () => {
  console.log("App listening on http://localhost:3000");
});
