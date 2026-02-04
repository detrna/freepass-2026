const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/create-order",
  authenticate,
  roleGuard("student"),
  orderController.createOrder,
);
router.get(
  "/view-incoming-orders",
  authenticate,
  roleGuard("owner"),
  orderController.viewIncomingOrders,
);
/*
router.put(
  "/update-order",
  authenticate,
  roleGuard("owner"),
  orderController.,
);
*/

module.exports = router;
