const Canteen = require("../models/canteenModel");
const Feedback = require("../models/feedbackModel");
const Order = require("../models/orderModel");

const createFeedback = async (req, res) => {
  const user = req.user;
  const { order_id, content } = req.body;

  const order = await Order.findById(order_id);

  if (!order) return res.status(400).json({ message: "Order didn't exist" });
  if (order.user_id !== user.id)
    return res
      .status(403)
      .json({ message: "User didn't own the order to place a feedback to" });
  if (order.progress_status !== "delivered")
    return res
      .status(400)
      .json({ message: "Can't give feedback to a yet to be delivered order" });

  const existingFeedback = await Feedback.findExistingOrder(order_id, user.id);
  if (existingFeedback)
    return res.status(400).json({
      message: "Feedback for this order by this user was already existed",
    });

  const canteen = await Canteen.findByMenuId(order.menu_id);

  const feedback = {
    content,
    order_id,
    user_id: user.id,
    canteen_id: canteen.id,
  };

  await Feedback.createFeedback(feedback);
  res.json({ message: "Feedback successfully sent" });
};

const viewFeedbackList = async (req, res) => {
  let user = req.user;

  const feedbacks =
    user.role === "student"
      ? await Feedback.findByUserId(user.id)
      : await Feedback.findByCanteenId(user.canteen_id);

  res.json(feedbacks);
};

const deleteFeedback = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const feedback = await Feedback.findById(id);
  console.log(feedback);
  if (!feedback)
    return res.status(400).json({ message: "Feedback didn't exist" });
  if (
    !(feedback.user_id === user.id || feedback.canteen_id === user.canteen_id)
  )
    return res.status(403).json({ message: "User didn't own this feedback" });

  await Feedback.deleteFeedback(id);
  res.json({ message: "Feedback deleted successfully" });
};

module.exports = { createFeedback, viewFeedbackList, deleteFeedback };
