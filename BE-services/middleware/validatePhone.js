const validator = require("validator");

const validatePhone = (req, res, next) => {
  const phone = req.body?.phone;

  if (!phone) {
    next();
    return;
  }

  const phoneValidation = validator.isMobilePhone(phone, "any");
  phoneValidation
    ? next()
    : res.status(400).json({ message: "Phone number invalid" });
};

module.exports = { validatePhone };
