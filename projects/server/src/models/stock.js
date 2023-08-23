module.exports = (sequelize, Sequelize) => {
  const stocks = sequelize.define(
    "stocks",
    {
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      shoe_id: {
        type: Sequelize.INTEGER,
      },
      shoe_size_id: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
      },
      booked_stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  return stocks;
};
