const warehouseRoutes = require("./warehouse");
const provinceCityRoutes = require("./province&city");
const shoeRoutes = require("./shoe");
const categoryRoutes = require("./category");
const brandRoutes = require("./brand");
const userRoutes = require("./user");
const subcategoryRoutes = require("./subCategory");
const shoeSizeRoutes = require("./shoeSize");
const stockRoutes = require("./stock");
const stockHistoryRoutes = require("./stockHistory");
const stockMutationRoutes = require("./stockMutation");
const cartRoutes = require("./cart");
const checkOutRoutes = require("./checkOut");
const orderRoutes = require("./order");
const addressFRoutes = require("./addressF");

module.exports = {
  provinceCityRoutes,
  warehouseRoutes,
  stockHistoryRoutes,
  shoeRoutes,
  categoryRoutes,
  brandRoutes,
  userRoutes,
  stockRoutes,
  subcategoryRoutes,
  shoeSizeRoutes,
  stockMutationRoutes,
  cartRoutes,
  checkOutRoutes,
  orderRoutes,
  addressFRoutes,
};
