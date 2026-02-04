const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authenticate");
const { validatePhone } = require("../middleware/validatePhone");

router.put("/", validatePhone, authenticate, userController.updateProfile);
router.get("/", authenticate, userController.getProfile);

module.exports = router;
