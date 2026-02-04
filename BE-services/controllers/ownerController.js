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

const updateMenu = async (req, res) => {
  const user = req.user;
  const { id, name, price, stock } = req.body;

  const currentMenu = await Menu.findMenuById(id);

  console.log(currentMenu);

  if (!currentMenu) res.status(400).json({ message: "Such menu didn't exist" });
  if (currentMenu.canteen_id !== user.canteen_id)
    return res.status(403).json({ message: "This user didn't own this menu" });

  const newMenu = {
    nama: name || currentMenu.name,
    price: price || currentMenu.price,
    stock: stock || currentMenu.stock,
  };

  await Menu.updateMenu(newMenu);
};

const deleteMenu = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const menu = await Menu.findMenuById(id);
  if (!menu) return res.status(400).json({ message: "Such menu didn't exist" });
  if (menu.canteen_id !== user.canteen_id)
    return res.status(403).json({ message: "This user didn't own this menu" });

  await Menu.deleteMenu(menu);
};

module.exports = { createMenu, updateMenu, deleteMenu };
