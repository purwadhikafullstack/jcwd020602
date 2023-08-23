module.exports = (sequelize, Sequelize) => {
  const stockHistories = sequelize.define(
    "stockHistories",
    {
      stock_before: Sequelize.INTEGER,
      stock_after: Sequelize.INTEGER,
      qty: Sequelize.INTEGER,
      stock_id: {
        type: Sequelize.INTEGER,
      },
      status: Sequelize.ENUM("ADDED", "DECREASED"),
      reference: {
        type: Sequelize.STRING, //manual, transaction_code, mutationId
      },
    },
    { paranoid: true }
  );
  return stockHistories;
};
