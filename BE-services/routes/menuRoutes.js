const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/create",
  authenticate,
  roleGuard("owner"),
  menuController.createMenu,
);

module.exports = router;
