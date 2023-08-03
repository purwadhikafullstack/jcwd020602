"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.StockMutation = require("./stockMutation")(sequelize, Sequelize); //id; (from_warehouse, to_warehouse, req_admin, res_admin, stock)
db.Stock = require("./stock")(sequelize, Sequelize); //id;(shoe, shoe_size, warehouse)
db.Address = require("./address")(sequelize, Sequelize); //id;(user, city, province)
db.OrderDetail = require("./orderDetail")(sequelize, Sequelize); //id; (order,stock)
db.StockHistory = require("./stockHistory")(sequelize, Sequelize); //id; (stock)
db.Order = require("./order")(sequelize, Sequelize); //id; (user, address)
db.Warehouse = require("./warehouse")(sequelize, Sequelize); //id;(city)
db.Cart = require("./cart")(sequelize, Sequelize); //id;(shoe, user)
db.User = require("./user")(sequelize, Sequelize); //id;(warehouse)
db.City = require("./city")(sequelize, Sequelize); //id;(province)
db.ShoeSize = require("./shoeSize")(sequelize, Sequelize);
db.Province = require("./province")(sequelize, Sequelize);
db.Token = require("./token")(sequelize, Sequelize);

db.Shoe = require("./shoe")(sequelize, Sequelize);
db.ShoeImage = require("./shoeImage")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.SubCategory = require("./subCategory")(sequelize, Sequelize);
db.Brand = require("./brand")(sequelize, Sequelize);
db.Admin = require("./admin")(sequelize, Sequelize);

// db.stock_Mutations foreignKey
db.Warehouse.hasMany(db.StockMutation, {
  foreignKey: "from_warehouse_id",
  targetKey: "id",
});
db.StockMutation.belongsTo(db.Warehouse, {
  foreignKey: "from_warehouse_id",
  targetKey: "id",
  as: "fromWarehouse",
});
db.Warehouse.hasMany(db.StockMutation, {
  foreignKey: "to_warehouse_id",
  targetKey: "id",
});
db.StockMutation.belongsTo(db.Warehouse, {
  foreignKey: "to_warehouse_id",
  targetKey: "id",
  as: "toWarehouse",
});
db.User.hasMany(db.StockMutation, {
  foreignKey: "req_admin_id",
  targetKey: "id",
});
db.StockMutation.belongsTo(db.User, {
  foreignKey: "req_admin_id",
  targetKey: "id",
  as: "requestedBy",
});
db.User.hasMany(db.StockMutation, {
  foreignKey: "res_admin_id",
  targetKey: "id",
});
db.StockMutation.belongsTo(db.User, {
  foreignKey: "res_admin_id",
  targetKey: "id",
  as: "respondedBy",
});
db.Stock.hasMany(db.StockMutation, {
  foreignKey: "stock_id",
  targetKey: "id",
});
db.StockMutation.belongsTo(db.Stock, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.Stock foreignKey
db.ShoeSize.hasMany(db.Stock, {
  foreignKey: "shoe_size_id",
  targetKey: "id",
});
db.Stock.belongsTo(db.ShoeSize, {
  foreignKey: "shoe_size_id",
  targetKey: "id",
});
db.Shoe.hasMany(db.Stock, {
  foreignKey: "shoe_id",
  targetKey: "id",
});
db.Stock.belongsTo(db.Shoe, {
  foreignKey: "shoe_id",
});
db.Warehouse.hasMany(db.Stock, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});
db.Stock.belongsTo(db.Warehouse, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});

//db.Address foreignKey
db.User.hasMany(db.Address, { foreignKey: "user_id", targetKey: "id" });
db.Address.belongsTo(db.City, { foreignKey: "city_id", targetKey: "city_id" });
db.Address.belongsTo(db.Province, {
  foreignKey: "province_id",
  targetKey: "province_id",
});

//db.OrderDetail foreignKey
db.Order.hasMany(db.OrderDetail, {
  foreignKey: "order_id",
  targetKey: "id",
});
db.Stock.hasMany(db.OrderDetail, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.StockHistory foreignKey
db.StockHistory.belongsTo(db.Stock, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.Order foreignKey
db.User.hasMany(db.Order, { foreignKey: "user_id", targetKey: "id" });
db.Address.hasMany(db.Order, { foreignKey: "address_id", targetKey: "id" });

//db.Warehouse foreignKey
db.Warehouse.belongsTo(db.City, {
  foreignKey: "city_id",
  targetKey: "city_id",
});

//db.Cart foreignKey
// db.Shoe.hasMany(db.Cart, { foreignKey: "shoe_id", targetKey: "id" });
db.Cart.belongsTo(db.Shoe, {
  foreignKey: "shoe_id",
  targetKey: "id",
  as: "Shoes",
});
db.Cart.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });

// db.User foreignKey
db.Warehouse.hasMany(db.User, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});
db.User.belongsTo(db.Warehouse, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});

//db.cities foreignKey
db.Province.hasMany(db.City, {
  foreignKey: "province_id",
});

//fahmi
db.Shoe.belongsTo(db.Brand, {
  foreignKey: "brand_id",
});
db.Shoe.belongsTo(db.SubCategory, {
  foreignKey: "subcategory_id",
});
db.Shoe.belongsTo(db.Category, {
  foreignKey: "category_id",
});
db.Brand.hasMany(db.Shoe, {
  foreignKey: "brand_id",
});
db.Category.hasMany(db.SubCategory, {
  foreignKey: "category_id",
});
db.Category.hasMany(db.Shoe, {
  foreignKey: "category_id",
});
db.SubCategory.belongsTo(db.Category, {
  foreignKey: "category_id",
});
db.SubCategory.hasMany(db.Shoe, {
  foreignKey: "subcategory_id",
});
db.Shoe.belongsTo(db.Category, {
  foreignKey: "category_id",
});
db.Category.hasMany(db.Shoe, {
  foreignKey: "category_id",
});

db.ShoeImage.belongsTo(db.Shoe, {
  foreignKey: "shoe_id",
});
db.Shoe.hasMany(db.ShoeImage, {
  foreignKey: "shoe_id",
});
db.Warehouse.hasMany(db.Admin, {
  foreignKey: "warehouse_id",
});
db.Admin.belongsTo(db.Warehouse, {
  foreignKey: "warehouse_id",
});
db.Admin.belongsTo(db.User, {
  foreignKey: "user_id",
});

module.exports = db;
