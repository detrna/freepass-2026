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
  try {
    const user = req.user;
    const { id, name, price, stock } = req.body;

    const currentMenu = await Menu.findMenuById(id);
    if (!currentMenu)
      res.status(400).json({ message: "Such menu didn't exist" });
    if (currentMenu.canteen_id !== user.canteen_id)
      return res
        .status(403)
        .json({ message: "This user didn't own this menu" });

    const newMenu = {
      id,
      nama: name || currentMenu.name,
      price: price || currentMenu.price,
      stock: stock || currentMenu.stock,
    };

    await Menu.updateMenu(newMenu);

    res.json({ message: "Menu updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error" });
  }
};

const deleteMenu = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  const menu = await Menu.findMenuById(id);
  if (!menu) return res.status(400).json({ message: "Such menu didn't exist" });
  if (menu.canteen_id !== user.canteen_id)
    return res.status(403).json({ message: "This user didn't own this menu" });

  await Menu.deleteMenu(menu);

  res.json({ message: "Menu deleted successfully" });
};

const viewMenus = async (req, res) => {
  const user = req.user;
  const id = user.canteen_id || req.params.canteen_id;

  const menus = await Menu.viewMenus(id);
  if (!menus) res.json({ message: "Menu didn't exist" });

  res.json(menus);
};

module.exports = { createMenu, updateMenu, deleteMenu, viewMenus };
