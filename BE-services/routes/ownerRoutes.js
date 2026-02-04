const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/create-menu",
  authenticate,
  //roleGuard("owner"),
  ownerController.createMenu,
);

module.exports = router;
