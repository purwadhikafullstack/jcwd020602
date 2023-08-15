module.exports = (sequelize, Sequelize) => {
  const carts = sequelize.define(
    "carts",
    {
      qty: Sequelize.INTEGER,
      // shoe_id:
      // user_id
      // shoe_size_id
    },
    {
      paranoid: true,
    }
  );
  return carts;
};
