module.exports = (sequelize, Sequelize) => {
  const stocks = sequelize.define(
    "stocks",
    {
      stock: Sequelize.INTEGER,
      shoe_id: {
        type: Sequelize.INTEGER,
      },
      shoe_size_id: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return stocks;
};
