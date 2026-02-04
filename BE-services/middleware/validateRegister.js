const validator = require("validator");

const validateRegister = (req, res, next) => {
  const { password, confirmPassword, email } = req.body;
  if (!password)
    return res.status(400).json({ message: "Password field can't be empty" });

  if (!confirmPassword)
    return res.status(400).json({ message: "Confirm field can't be empty" });

  if (!email)
    return res.status(400).json({ message: "Email field can't be empty" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Password didn't match" });

  if (!validator.isEmail(email))
    return res.status(400).json({ message: "Email was invalid" });

  next();
};

module.exports = { validateRegister };
