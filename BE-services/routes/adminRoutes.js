const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");
const { validatePhone } = require("../middleware/validatePhone");

router.put(
  "/modify",
  validatePhone,
  authenticate,
  roleGuard("admin"),
  adminController.updateUser,
);
router.delete(
  "/terminate",
  authenticate,
  roleGuard("admin"),
  adminController.deleteUser,
);

module.exports = router;
