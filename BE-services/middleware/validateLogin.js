const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email field can't be empty" });
  if (!password)
    return res.status(400).json({ message: "Password field can't be empty" });

  next();
};

module.exports = { validateLogin };
