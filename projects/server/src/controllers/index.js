const warehouseController = require("./warehouse");
const provinceCityController = require("./province&city");
const getAllStockHistory = require("./getAllStockHistory");

const shoeController = require("./shoe");
const categoryController = require("./category");
const brandController = require("./brand");
const shoeimageController = require("./shoeImage");


const addressController = require("./address");

module.exports = {
  warehouseController,
  provinceCityController,
  getAllStockHistory,

  shoeController,
  categoryController,
  brandController,
  shoeimageController,
  
  addressController,
};
