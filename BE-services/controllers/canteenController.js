const Canteen = require("../models/canteenModel");

const browseMenu = async (req, res) => {
  const canteens = await Canteen.getCanteenListing();

  const menu = canteens.flatMap((m) => {
    if (m.id) return m;
    return;
  });

  console.log(menu);

  const payload = canteens.map((c) => {
    return {
      ...c,
      id: c.id,
      name: c.name,
      menu: menu.map((m) => {
        return {
          ...m,
          id: m.id,
          name: m.name,
          price: m.price,
          stock: m.stock,
        };
      }),
    };
  });

  res.json(payload);
};

module.exports = { browseMenu };
