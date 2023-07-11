module.exports = (sequelize, Sequelize) => {
  const carts = sequelize.define(
    "carts",
    {
      qty: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
      shoe_id: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return carts;
};
