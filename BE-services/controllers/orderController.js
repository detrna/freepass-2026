const Canteen = require("../models/canteenModel");
const Menu = require("../models/menuModel");
const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  const user = req.user;
  const { menu_id, quantity } = req.body;

  const menu = await Menu.findMenuById(menu_id);
  if (menu.stock === 0)
    return res.status(400).json({ message: "Menu is out of stock" });

  const price = menu.price;
  const amount = price * quantity;

  const order = {
    price,
    quantity,
    amount,
    menu_id,
    user_id: user.id,
  };

  await Order.createOrder(order);
  await Menu.decreaseStock(menu_id);

  res.json({ message: "Order successfully placed" });
};

const viewIncomingOrders = async (req, res) => {
  const user = req.user;
  const orders = await Order.getOrdersByCanteenId(user.canteen_id);
  res.json(orders);
};

const viewPlacedOrders = async (req, res) => {
  const user = req.user;
  const orders = await Order.getOrdersByUserId(user.id);
  res.json(orders);
};

const cancelOrder = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const order = await Order.findById(id);
  if (!order)
    return res.status(400).json({ message: "This order didn't exist" });
  if (!order.user_id !== user.id)
    return res.status(403).json({ message: "User didn't own this order" });

  await Order.cancelOrder(id);

  res.json({ message: "Order successfully cancelled" });
};

const deleteOrder = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const order = await Order.findById(id);
  if (!order)
    return res.status(400).json({ message: "This order didn't exist" });

  const canteen = await Canteen.findByMenuId(order.menu_id);
  if (canteen.user_id !== user.id)
    return res
      .status(403)
      .json({ message: "User didn't own the canteen where this order belong" });

  if (order.progress_status !== "cancelled") {
    if (order.progress_status === "abandoned")
      return res
        .status(400)
        .json({ message: "Cannot delete an ongoing order" });
    return res.status(400).json({ message: "Cannot delete an ongoing order" });
  }

  await Order.deleteOrder(id);
  res.json({ message: "Order successfully deleted" });
};

module.exports = {
  createOrder,
  viewIncomingOrders,
  viewPlacedOrders,
  cancelOrder,
  deleteOrder,
};
