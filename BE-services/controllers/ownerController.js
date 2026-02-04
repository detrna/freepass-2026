const Menu = require("../models/menuModel");

const createMenu = async (req, res) => {
  const user = req.user;
  const { name, price, stock } = req.body;

  const menu = {
    name,
    price,
    stock,
    canteen_id: user.canteen_id,
  };
  await Menu.createMenu(menu);
  res.json({ message: "Menu succesfully added" });
};

module.exports = { createMenu };
