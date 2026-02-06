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
router.put(
  "/update",
  authenticate,
  roleGuard("owner"),
  menuController.updateMenu,
);
router.delete(
  "/delete",
  authenticate,
  roleGuard("owner"),
  menuController.deleteMenu,
);
router.get("/", authenticate, menuController.viewMenus);
router.get("/:canteen_id", authenticate, menuController.viewMenus);

module.exports = router;
