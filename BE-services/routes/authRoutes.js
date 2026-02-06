const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateRegister");
const { authenticate } = require("../middleware/authenticate");
const { inputGuard } = require("../middleware/inputGuard");

router.post("/register", validateRegister, authController.register);
router.post(
  "/login",
  inputGuard(["email", "password"], ["string", "string"]),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.delete("/logout", authenticate, authController.logout);
router.get("/fetch-cookie", authenticate, authController.fetchCookie);

module.exports = router;
