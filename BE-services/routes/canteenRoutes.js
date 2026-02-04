const express = require("express");
const router = express.Router();
const canteenController = require("../controllers/canteenController");

router.get("/", canteenController.browseMenu);

module.exports = router;
