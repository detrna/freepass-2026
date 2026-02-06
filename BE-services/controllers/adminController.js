const { AUTH_CONFIG } = require("../config/constant");
const Canteen = require("../models/canteenModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!(role === "owner" || role === "admin"))
      return res
        .status(400)
        .json({ message: "Role must be either owner or admin" });

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

    await User.createUser(user);

    const payload = {
      message: "Account succesfully registered",
      displayedMessage: `Account successfully registered by the name of ${name} and email of ${email}`,
    };

    return res.status(201).json(payload);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).json({ error: err.name });
  }
};

const deleteUser = async (req, res) => {
  const { id, email } = req.body;
  let account;
  if (!id) account = User.findByEmail(email);

  await User.deleteUser(id || account.id);
  res.json({ message: "Account successfully deleted" });
};

const updateUser = async (req, res) => {
  try {
    const { id, name, email, password, phone } = req.body;

    if (email) {
      const emailTaken = await User.findByEmail(email);
      if (emailTaken)
        return res.status(400).json({ message: "Email was already taken" });
    }

    const currentUser = await User.findById(id);

    const newHashedPassword = password
      ? await bcrypt.hash(password, bcryptSalt)
      : currentUser.hashed_password;

    const newUser = {
      id,
      name: name || currentUser.name,
      email: email || currentUser.email,
      password: newHashedPassword,
      phone: phone || currentUser.phone,
    };

    await User.updateUser(newUser);

    return res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error", error: err.name });
  }
};

const createCanteen = async (req, res) => {
  const { name, phone, user_id } = req.body;

  const existingCanteen = await Canteen.findByUserId(user_id);
  if (existingCanteen)
    return res
      .status(400)
      .json({ message: "This account already has a canteen registered" });

  const user = await User.findById(user_id);
  if (user.role !== "owner")
    return res.status(400).json({ message: "User was not a canteen owner" });

  const canteen = {
    name,
    phone,
    user_id,
  };

  await Canteen.createCanteen(canteen);
  res.json({ message: "Canteen added successfully" }, canteen);
};

const updateCanteen = async (req, res) => {
  const { name, phone, user_id } = req.body;

  const existingCanteen = await Canteen.findByUserId(user_id);

  const canteen = {
    name: name || existingCanteen.name,
    phone: phone || existingCanteen.phone,
    user_id: user_id || existingCanteen.user_id,
  };

  await Canteen.updateCanteen(canteen);
  res.json({ message: "Canteen successfully updated" });
};

const deleteCanteen = async (req, res) => {
  const { id } = req.body;

  const canteen = await Canteen.findById(id);
  if (!canteen) res.status(400).json({ message: "Canteen didn't exist" });

  await Canteen.deleteCanteen(id);
  res.json({ message: "Canteen successfuly deleted" });
};

module.exports = {
  deleteUser,
  updateUser,
  createCanteen,
  updateCanteen,
  registerUser,
  deleteCanteen,
};
