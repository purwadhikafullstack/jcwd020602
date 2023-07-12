const warehouseRouter = require("./warehouse");
const provinceCityRouter = require("./province&city");
const stockHistory = require("./stock_history");
const addressRouter = require("./address");
module.exports = {
  provinceCityRouter,
  warehouseRouter,
  stockHistory,
  addressRouter,
};
