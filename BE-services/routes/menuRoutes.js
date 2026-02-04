const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/create-menu",
  authenticate,
  roleGuard("owner"),
  menuController.createMenu,
);
router.put(
  "/update-menu",
  authenticate,
  roleGuard("owner"),
  menuController.updateMenu,
);
router.delete(
  "/delete-menu/:id",
  authenticate,
  roleGuard("owner"),
  menuController.deleteMenu,
);

module.exports = router;
