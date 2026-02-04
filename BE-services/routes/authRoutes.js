const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateRegister");
const { authenticate } = require("../middleware/authenticate");
const { validateLogin } = require("../middleware/validateLogin");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.delete("/logout", authenticate, authController.logout);

module.exports = router;
