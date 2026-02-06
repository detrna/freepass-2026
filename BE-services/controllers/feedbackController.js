const Order = require("../models/orderModel");

const createFeedback = async (req, res) => {
  const user = req.user;
  const { order_id, content } = req.body;

  const order = Order.findById(order_id);
  if (order.user_id !== user.id)
    return res
      .status(403)
      .json({ message: "User didn't own the order to place a feedback to" });
};
