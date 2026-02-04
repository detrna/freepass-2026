const Canteen = require("../models/canteenModel");
const User = require("../models/userModel");

const deleteUser = async (req, res) => {
  const { id, email } = req.body;
  let account;
  if (!id) account = User.findByEmail(email);

  await User.deleteUser(id || account.id);
  res.json({ message: "Account successfully deleted" });
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;

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

module.exports = { deleteUser, updateUser, createCanteen, updateCanteen };
