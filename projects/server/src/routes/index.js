const warehouseRouter = require("./warehouse");
const provinceCityRouter = require("./province&city");
const stockHistory = require("./stock_history");
const shoeRoutes = require("./shoe");
const categoryRoutes = require("./category");
const brandRoutes = require("./brand");
const shoeimageRoutes = require("./shoeimage");

module.exports = {
  provinceCityRouter,
  warehouseRouter,
  stockHistory,
  shoeRoutes,
  categoryRoutes,
  brandRoutes,
  shoeimageRoutes,
};
