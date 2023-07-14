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

db.stockMutations = require("./stockMutation")(sequelize, Sequelize); //id; (from_warehouse, to_warehouse, req_admin, res_admin, stock)
db.orderDetails = require("./orderDetail")(sequelize, Sequelize); //id; (order,stock)
db.stockHistories = require("./stockHistory")(sequelize, Sequelize); //id; (stock)
db.stocks = require("./stock")(sequelize, Sequelize); //id;(shoe_size, warehouse)
db.orders = require("./order")(sequelize, Sequelize); //id; (user, address)
db.addresses = require("./address")(sequelize, Sequelize); //id;(user)
db.carts = require("./cart")(sequelize, Sequelize); //id;(shoe, user)
db.users = require("./user")(sequelize, Sequelize); //id;(warehouse)
db.cities = require("./city")(sequelize, Sequelize); //id;(province)
db.warehouses = require("./warehouse")(sequelize, Sequelize);
db.shoeSizes = require("./shoeSize")(sequelize, Sequelize);
db.provinces = require("./province")(sequelize, Sequelize);
db.tokens = require("./token")(sequelize, Sequelize);

db.Shoe = require("./shoe")(sequelize, Sequelize);
db.Shoeimage = require("./shoeImage")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Subcategory = require("./subCategory")(sequelize, Sequelize);
db.Brand = require("./brand")(sequelize, Sequelize);

// db.stock_Mutations foreignKey
db.warehouses.hasMany(db.stockMutations, {
  foreignKey: "from_warehouse_id",
  targetKey: "id",
});
db.warehouses.hasMany(db.stockMutations, {
  foreignKey: "to_warehouse_id",
  targetKey: "id",
});
db.users.hasMany(db.stockMutations, {
  foreignKey: "req_admin_id",
  targetKey: "id",
});
db.users.hasMany(db.stockMutations, {
  foreignKey: "res_admin_id",
  targetKey: "id",
});
db.stocks.hasMany(db.stockMutations, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.orderDetails foreignKey
db.orders.hasMany(db.orderDetails, {
  foreignKey: "order_id",
  targetKey: "id",
});
db.stocks.hasMany(db.orderDetails, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.stockHistories foreignKey
db.stocks.hasMany(db.stockHistories, {
  foreignKey: "stock_id",
  targetKey: "id",
});

//db.stocks foreignKey
db.shoeSizes.hasMany(db.stocks, {
  foreignKey: "shoe_size_id",
  targetKey: "id",
});
db.Shoe.hasMany(db.stocks, {
  foreignKey: "shoe_id",
});
db.warehouses.hasMany(db.stocks, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});

//db.orders foreignKey
db.users.hasMany(db.orders, { foreignKey: "user_id", targetKey: "id" });
db.addresses.hasMany(db.orders, { foreignKey: "address_id", targetKey: "id" });

//db.addresses foreignKey
db.users.hasMany(db.addresses, { foreignKey: "user_id", targetKey: "id" });

//db.Carts foreignKey
db.Shoe.hasMany(db.carts, { foreignKey: "shoe_id", targetKey: "id" });
db.users.hasMany(db.carts, { foreignKey: "user_id", targetKey: "id" });

//db.users foreignKey
db.warehouses.hasMany(db.users, {
  foreignKey: "warehouse_id",
  targetKey: "id",
});

//db.cities foreignKey
db.provinces.hasMany(db.cities, {
  foreignKey: "province_id",
  targetKey: "province_id",
});

//fahmi
db.Shoe.belongsTo(db.Brand, {
  foreignKey: "brand_id",
});
db.Shoe.belongsTo(db.Subcategory, {
  foreignKey: "subcategory_id",
});

db.Brand.hasMany(db.Shoe, {
  foreignKey: "brand_id",
});

db.Category.hasMany(db.Subcategory, {
  foreignKey: "category_id",
});
db.Subcategory.belongsTo(db.Category, {
  foreignKey: "category_id",
});
db.Subcategory.hasMany(db.Shoe, {
  foreignKey: "subcategory_id",
});

db.Shoeimage.belongsTo(db.Shoe, {
  foreignKey: "shoe_id",
});
db.Shoe.hasMany(db.Shoeimage, {
  foreignKey: "shoe_id",
});

module.exports = db;
