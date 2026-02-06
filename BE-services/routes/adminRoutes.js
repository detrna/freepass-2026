const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");
const { validatePhone } = require("../middleware/validatePhone");

router.post(
  "/register-account",
  authenticate,
  roleGuard("admin"),
  adminController.registerUser,
);
router.put(
  "/update-account",
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
router.post(
  "/register-canteen",
  authenticate,
  roleGuard("admin"),
  adminController.createCanteen,
);
router.put(
  "/update-canteen",
  authenticate,
  roleGuard("admin"),
  adminController.updateCanteen,
);
router.delete(
  "/delete-canteen",
  authenticate,
  roleGuard("admin"),
  adminController.deleteCanteen,
);

module.exports = router;
