const warehouseRoutes = require("./warehouse");
const provinceCityRoutes = require("./province&city");
const stockHistory = require("./stock_history");
const shoeRoutes = require("./shoe");
const categoryRoutes = require("./category");
const brandRoutes = require("./brand");
const shoeimageRoutes = require("./shoeimage");
const addressRoutes = require("./address");
const userRoutes = require("./user");

module.exports = {
  provinceCityRoutes,
  warehouseRoutes,
  stockHistory,
  shoeRoutes,
  categoryRoutes,
  brandRoutes,
  shoeimageRoutes,
  addressRoutes,
  userRoutes,
};
