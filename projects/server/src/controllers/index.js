const warehouseController = require("./warehouse");
const provinceCityController = require("./province&city");
const shoeController = require("./shoe");
const categoryController = require("./category");
const brandController = require("./brand");
const addressController = require("./address");
const userController = require("./user");
const stockController = require("./stock");
const shoeSizeController = require("./shoeSize");
const stockHistoryController = require("./stockHistory");
const stockMutationController = require("./stockMutation");
const cartController = require("./cartController");

module.exports = {
  userController,
  addressController,
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
};
