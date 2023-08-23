module.exports = (sequelize, Sequelize) => {
  const orderDetails = sequelize.define(
    "orderDetails",
    {
      qty: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
      stock_id: {
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return orderDetails;
};
