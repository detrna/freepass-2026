const Canteen = require("../models/canteenModel");
const Menu = require("../models/menuModel");

const createMenu = async (req, res) => {
  const user = req.user;
  const { name, price, stock } = req.body;

  const canteen = await Canteen.findByUserId(user.id);

  const menu = {
    name,
    price,
    stock,
    canteen_id: canteen.id,
  };

  await Menu.createMenu(menu);

  res.json({ message: "Menu successfully added", menu: menu });
};

module.exports = { createMenu };
