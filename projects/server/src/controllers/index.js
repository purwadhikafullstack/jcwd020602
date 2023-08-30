const warehouseController = require("./warehouse");
const provinceCityController = require("./province&city");
const shoeController = require("./shoe");
const categoryController = require("./category");
const brandController = require("./brand");
const userController = require("./user");
const stockController = require("./stock");
const shoeSizeController = require("./shoeSize");
const stockHistoryController = require("./stockHistory");
const stockMutationController = require("./stockMutation");
const cartController = require("./cartController");
const checkOutController = require("./checkOut");
const orderController = require("./order");
const addressFController = require("./addressF");
const salesReportController = require("./salesReport");

module.exports = {
  userController,
  provinceCityController,
  warehouseController,
  shoeController,
  categoryController,
  brandController,
  shoeSizeController,
  stockController,
  stockHistoryController,
  stockMutationController,
  cartController,
  checkOutController,
  orderController,
  addressFController,
  salesReportController,
};
