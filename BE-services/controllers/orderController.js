const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  const user = req.user;
  const { menu_id } = req.body;

  console.log(user, menu_id);

  await Order.createOrder(menu_id, user.id);

  res.json({ message: "Order successfully placed" });
};

const viewIncomingOrders = async (req, res) => {
  const user = req.user;
  const orders = await Order.viewIncomingOrders(user.canteen_id);
  res.json(orders);
};

module.exports = { createOrder, viewIncomingOrders };
