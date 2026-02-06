const { PAYMENT_CONFIG } = require("../config/constant");
const Canteen = require("../models/canteenModel");
const Menu = require("../models/menuModel");
const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  const user = req.user;
  const { menu_id, quantity } = req.body;

  const menu = await Menu.findMenuById(menu_id);
  if (!menu) return res.status(400).json({ message: "Such menu didn't exist" });
  if (menu.stock === 0 || menu.stock < quantity)
    return res.status(400).json({ message: "Menu is out of stock" });

  const price = menu.price;
  const amount = price * quantity;
  const decreasedStock = menu.stock - quantity;

  const order = {
    price,
    quantity,
    amount,
    menu_id,
    user_id: user.id,
  };

  await Order.createOrder(order);
  await Menu.decreaseStock(menu_id, decreasedStock);

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

const updateOrder = async (req, res) => {
  const user = req.user;
  const { id, progress_status } = req.body;

  if (progress_status) {
    if (
      !(
        progress_status === "cooking" ||
        progress_status === "ready" ||
        progress_status === "delivered"
      )
    )
      return res.status(400).json({ message: "Status not recognized" });
  }

  const order = await Order.findById(id);
  if (!order)
    return res.status(400).json({ message: "This order didn't exist" });
  if (user.role === "student") {
    if (order.user_id !== user.id)
      return res.status(403).json({ message: "User didn't own this order" });
  } else {
    const canteen = await Canteen.findByMenuId(order.menu_id);
    if (canteen.id !== user.canteen_id)
      return res.status(403).json({
        message: "User didn't own the canteen where this order belong",
      });
    if (order.payment_status === 0)
      return res
        .status(400)
        .json({ message: "Cannot update a yet to paid order" });
  }

  const updatedOrder = {
    id,
    progress_status: progress_status || "cancelled",
  };

  await Order.updateProgress(updatedOrder);

  res.json({
    message: `Progress status successfully set to ${updatedOrder.progress_status}`,
  });
};

const closeOrder = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const order = await Order.findById(id);
  if (!order)
    return res.status(400).json({ message: "This order didn't exist" });
  if (order.user_id !== user.id)
    return res.status(403).json({ message: "User didn't own this order" });
  if (order.progress_status !== "cancelled")
    return res.status(400).json({ message: "Can't close an ongoing order" });

  await Order.closeOrder(id);

  res.json({ message: "Order successfully closed" });
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

const handlePayment = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const order = await Order.getPaymentDetails(id);
  if (!order)
    return res.status(400).json({ message: "This order didn't exist" });
  if (order.user_id !== user.id)
    return res.status(403).json({ message: "User didn't own this order" });

  const serverKey = process.env.SERVER_KEY;
  const password = "";
  const credentials = `${serverKey}:${password}`;
  const base64String = Buffer.from(credentials).toString("base64");

  const transaction_details = {
    order_id: id.toString(),
    gross_amount: order.amount,
  };
  const customer_details = {
    first_name: order.customer_name,
    email: order.customer_email,
    phone: order.customer_phone || null,
  };
  const item_details = [
    {
      id: order.menu_id,
      name: order.menu_name,
      price: order.menu_price,
      quantity: order.quantity,
      category: "Food",
      merchant_name: order.canteen_name,
    },
  ];

  const payload = {
    transaction_details,
    item_details,
    customer_details,
    usage_limit: 2,
    expiry: PAYMENT_CONFIG.EXPIRY,
  };

  const url = "https://api.sandbox.midtrans.com/v1/payment-links";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Basic ${base64String}`,
    },
    body: JSON.stringify(payload),
  };
  try {
    const midtransRes = await fetch(url, options);
    const data = await midtransRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Midtrans API error" });
  }
};

const handleNotification = async (req, res) => {
  console.log("Notif Hit");
  const { order_id, transaction_status, fraud_status } = req.body;

  if (
    !(transaction_status === "capture" || transaction_status === "settlement")
  ) {
    console.log("payment:", transaction_status);
    return res.status(200).json({ message: "Payment has yet to be made" });
  }

  if (transaction_status === "caputre" && fraud_status !== "accept") {
    console.log("Card", fraud_status);
    return res
      .status(200)
      .json({ message: "Fraud status has yet to be accepted" });
  }

  const order = {
    id: order_id.split("-")[0],
    payment_status: true,
  };

  console.log(order);
  await Order.updatePayment(order);
};

module.exports = {
  createOrder,
  viewIncomingOrders,
  viewPlacedOrders,
  updateOrder,
  closeOrder,
  deleteOrder,
  handlePayment,
  handleNotification,
};
