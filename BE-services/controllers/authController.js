const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { AUTH_CONFIG } = require("../config/constant");
const Canteen = require("../models/canteenModel");

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email was already taken" });

    const name = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);

    const user = {
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    };

    const createdUser = await User.createUser(user);

    const payload = {
      message: "Account succesfully registered",
      displayedMessage: `Account successfully registered by the name of ${name} and saved email by ${email}`,
    };

    if (role === "owner") return res.status(201).json(payload);

    //sign jwt
    const jwtPayload = {
      id: createdUser.insertId,
      name: name,
      role: "student",
    };

    const accessToken = jwt.sign(
      jwtPayload,
      process.env.JWT_ACCESS_KEY,
      AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
    );
    res.cookie("access_token", accessToken, AUTH_CONFIG.COOKIE);
    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.JWT_REFRESH_KEY,
      AUTH_CONFIG.REFRESH_TOKEN_EXPIRY,
    );

    res.cookie("refresh_token", refreshToken, AUTH_CONFIG.COOKIE);

    res.status(201).json(payload);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).json({ error: err.name });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user)
    return res.status(401).json({ message: "Incorrect email or password" });

  const isMatch = await bcrypt.compare(password, user.hashed_password);
  if (!isMatch)
    return res.status(401).json({ message: "Incorrect email or password" });

  let jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  if (user.role === "owner") {
    const canteen = await Canteen.findByUserId(user.id);
    jwtPayload = { ...jwtPayload, canteen_id: canteen.id };
  }

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_KEY,
    AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
  );
  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.JWT_REFRESH_KEY,
    AUTH_CONFIG.REFRESH_TOKEN_EXPIRY,
  );

  res.cookie("refresh_token", refreshToken, AUTH_CONFIG.COOKIE);
  res.cookie("access_token", accessToken, AUTH_CONFIG.COOKIE);

  res.json({ message: "Successfully logged in" });
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken)
    return res.status(401).json({ message: "User account didn't exist" });

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    let jwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    if (user.role === "owner") {
      const canteen = await Canteen.findByUserId(user.id);
      jwtPayload = { ...jwtPayload, canteen_id: canteen.id };
    }

    console.log(AUTH_CONFIG.ACCESS_TOKEN_EXPIRY);

    const accessToken = jwt.sign(
      jwtPayload,
      process.env.JWT_ACCESS_KEY,
      AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
    );
    const newRefreshToken = jwt.sign(
      jwtPayload,
      process.env.JWT_REFRESH_KEY,
      AUTH_CONFIG.REFRESH_TOKEN_EXPIRY,
    );

    res.cookie("access_token", accessToken, AUTH_CONFIG.COOKIE);
    res.cookie("refresh_token", newRefreshToken, AUTH_CONFIG.COOKIE);

    return res
      .status(200)
      .json({ message: "Refresh token and session successfully refreshed" });
  } catch {
    return res.status(403).json({
      message: "Long term session has expired",
      postmanOnlyMessage: "Plase log in again",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token", AUTH_CONFIG.COOKIE);
  res.clearCookie("refresh_token", AUTH_CONFIG.COOKIE);
  res.json({ message: "Successfully logged out" });
};

const fetchCookie = (req, res) => {
  const user = req.user;
  res.json(user);
};

module.exports = { register, login, refresh, logout, fetchCookie };
