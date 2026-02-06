const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/create",
  authenticate,
  roleGuard("student"),
  orderController.createOrder,
);
router.get(
  "/incoming-orders",
  authenticate,
  roleGuard("owner"),
  orderController.viewIncomingOrders,
);
router.get(
  "/placed-orders",
  authenticate,
  roleGuard("student"),
  orderController.viewPlacedOrders,
);
router.put("/update", authenticate, orderController.updateOrder);
router.put(
  "/close",
  authenticate,
  roleGuard("student"),
  orderController.closeOrder,
);
router.delete(
  "/delete",
  authenticate,
  roleGuard("owner"),
  orderController.deleteOrder,
);
router.put(
  "/pay",
  authenticate,
  roleGuard("student"),
  orderController.handlePayment,
);
router.post("/notification", orderController.handleNotification);

module.exports = router;
