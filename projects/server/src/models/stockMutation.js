const moment = require("moment");
module.exports = (sequelize, Sequelize) => {
  const stockMutations = sequelize.define(
    "stockMutations",
    {
      req_admin_id: {
        type: Sequelize.INTEGER,
      },
      from_warehouse_id: {
        type: Sequelize.INTEGER,
      },
      to_warehouse_id: {
        type: Sequelize.INTEGER,
      },
      qty: Sequelize.INTEGER,
      stock_id: {
        type: Sequelize.INTEGER,
      },
      status: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
      res_admin_id: {
        type: Sequelize.INTEGER,
      },
      mutation_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: JSON.stringify({ MUT: "default" }), // Set a default value for now
        unique: true,
      },
    },
    {
      paranoid: true,
      hooks: {
        afterCreate: async (instance, options) => {
          const mutation_code = `MUT/${moment().format("DDMMYYYY")}${
            instance.id
          }${moment().format("HHmmss")}`;
          await instance.update(
            { mutation_code: mutation_code },
            { transaction: options.transaction }
          );
        },
      },
    }
  );
  return stockMutations;
};
