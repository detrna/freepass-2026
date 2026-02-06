const { AUTH_CONFIG } = require("../config/constant");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, oldPassword, newPassword, phone } = req.body;

    if (newPassword && !oldPassword)
      return res.status(400).json({
        message: "Please enter old password to change current password",
      });

    if (email) {
      const emailTaken = await User.findByEmail(email);
      if (emailTaken)
        return res.status(400).json({ message: "Email was already taken" });
    }

    const currentUser = await User.findById(user.id);

    if (oldPassword && newPassword) {
      const passwordValidation = await bcrypt.compare(
        oldPassword,
        currentUser.hashed_password,
      );

      if (!passwordValidation)
        return res.status(401).json({ message: "Incorrect password" });
    }

    const newHashedPassword = newPassword
      ? await bcrypt.hash(newPassword, bcryptSalt)
      : currentUser.hashed_password;

    const newUser = {
      id: user.id,
      name: name || currentUser.name,
      email: email || currentUser.email,
      password: newHashedPassword,
      phone: phone || currentUser.phone,
    };

    await User.updateUser(newUser);

    const jwtPayload = {
      id: user.id,
      name: newUser.name,
      role: user.role,
    };

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

    return res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error", error: err.name });
  }
};

const getProfile = async (req, res) => {
  const user = req.user;
  const profile = await User.findById(user.id);
  console.log(profile);
  const payload = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
  };
  res.json(payload);
};

const deleteAccount = async (req, res) => {
  const user = req.user;
  await User.deleteUser(user.id);

  res.clearCookie("access_token", AUTH_CONFIG.COOKIE);
  res.clearCookie("refresh_token", AUTH_CONFIG.COOKIE);

  res.json({ message: "Account successfully deleted" });
};

module.exports = { updateProfile, getProfile, deleteAccount };
