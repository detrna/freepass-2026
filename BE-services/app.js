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
const refreshTokenExpiry = { expiresIn: "1h" };
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

app.put("/profile", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { name, email, oldPassword, newPassword, phone } = req.body;
    let newHashedPassword;

    if (phone) {
      const phoneValidation = validator.isMobilePhone(phone, "any");
      if (!phoneValidation)
        return res.status(400).json({ message: "Phone number invalid" });
    }

    if (newPassword && !oldPassword)
      return res.status(400).json({
        message: "Please enter old password to change current password",
      });

    const [currentUser] = await pool.query(
      "SELECT name, email, hashed_password, phone FROM user WHERE id = ?",
      [user.id],
    );

    if (oldPassword && newPassword) {
      const passwordValidation = await bcrypt.compare(
        oldPassword,
        currentUser[0].hashed_password,
      );

      if (!passwordValidation)
        return res.status(401).json({ message: "Incorrect password" });

      newHashedPassword = await bcrypt.hash(newPassword, bcryptSalt);
    }

    const newUser = {
      name: name ? name : currentUser[0].name,
      email: email ? email : currentUser[0].email,
      password: newPassword
        ? newHashedPassword
        : currentUser[0].hashed_password,
      phone: phone ? phone : currentUser[0].phone,
    };

    const updateUser = pool.query(
      "UPDATE user SET name = ?, email = ?, hashed_password = ?, phone = ? WHERE id = ?",
      [newUser.name, newUser.email, newUser.password, newUser.phone, user.id],
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error", error: err.name });
  }
});

app.get("/canteen", (req, res) => {
  const [rows] = pool.query(
    "SELECT c.id as canteenId, c.name AS canteenName, m* FROM canteen c INNER JOIN menu m ON c.id = m.canteen_id",
  );

  const menu = rows.flatMap((m) => {
    if (m.id) return m;
    return;
  });

  console.log(menu);

  const payload = rows.map((r) => {
    return {
      ...r,
      id: r.id,
      name: r.name,
      menu: menu.map((m) => {
        return {
          ...m,
          id: m.id,
          name: m.name,
          price: m.price,
          stock: m.stock,
        };
      }),
    };
  });

  res.json(payload);
});

app.post("/canteen", authenticate, (req, res) => {
  const { name, ownerId, phone } = req.body;

  const [currentUser] = pool.query("SELECT role FROM user WHERE id = ?", [
    ownerId,
  ]);

  if (currentUser[0].role === "Owner")
    return res.status(400).json({ message: "User was not a canteen owner" });

  if (!phone) phone = null;

  const createCanteen = pool.query(
    "INSERT INTO canteen (name, user_id, phone) VALUES (?, ?, ?)",
    [name, ownerId, phone],
  );
});

app.post("/menu/:canteen_id", authenticate, (req, res) => {
  const user = req.user;
  const { canteen_id } = req.params;
  const { name, price, stock } = req.body;

  const [rows] = pool.query("SELECT canteen_id FROM user WHERE id = ?", [
    user.id,
  ]);

  if (rows.length === 0)
    return res.status(403).json({ message: "User didn't own this canteen" });

  const createMenu = pool.query(
    "INSERT INTO menu (name, price, stock, canteen_id) VALUES (?, ?, ?, ?)",
    [name, price, stock, canteen_id],
  );

  res.json({ message: "Menu successfully added" });
});

function authenticate(req, res, next) {
  const accessToken = req.cookies.access_token;
  if (!accessToken)
    return res.status(403).json({ message: "User not logged in" });

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Session has expired",
      code: "ACCESS_TOKEN_EXPIRED",
      postmanOnlyMessage:
        "Session will be refreshed and this endpoint is soon to be fetched again in the background. To view the result, please check the console (ctrl + alt + c)",
    });
  }
}

app.post("/refresh", (req, res) => {
  console.log("Refresh hit");
  const refreshToken = req.cookies.refresh_token;
  console.log(refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "User account didn't exist" });

  try {
    console.log("try catch");
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    console.log(user);

    const jwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(
      jwtPayload,
      process.env.JWT_ACCESS_KEY,
      accessTokenExpiry,
    );
    const newRefreshToken = jwt.sign(
      jwtPayload,
      process.env.refreshToken,
      refreshTokenExpiry,
    );

    res.cookie("access_token", accessToken, cookieConfig);
    res.cookie("refresh_token", newRefreshToken, cookieConfig);

    return res
      .status(200)
      .json({ message: "Refresh token successfully refreshed" });
  } catch {
    console.log("Test");
    return res.status(403).json({
      message: "Long term session has expired",
      postmanOnlyMessage: "Plase log in again",
    });
  }
});

app.listen(3001, () => {
  console.log("App listening on http://localhost:3000");
});
