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
      approved_at: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return stockMutations;
};
