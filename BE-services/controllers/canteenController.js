const Canteen = require("../models/canteenModel");

const browseMenu = async (req, res) => {
  const canteens = await Canteen.getCanteenListing();

  const menu = canteens.flatMap((c) => {
    return {
      id: c.menu_id,
      name: c.menu_name,
      price: c.menu_price,
      stock: c.menu_stock,
      canteen_id: c.menu_canteen_id,
    };
  });

  let payload = [];

  for (let i = 0; i < canteens.length; i++) {
    if (i !== canteens.length - 1)
      if (canteens[i].id === canteens[i + 1].id) continue;

    payload = [
      ...payload,
      {
        id: canteens[i].id,
        name: canteens[i].name,
        phone: canteens[i].phone,
        user_id: canteens[i].user_id,
        menu: menu.filter((m) => {
          if (m.canteen_id === canteens[i].id)
            return { id: m.id, name: m.name, price: m.price, stock: m.stock };
        }),
      },
    ];
  }

  res.json(payload);
};

module.exports = { browseMenu };
