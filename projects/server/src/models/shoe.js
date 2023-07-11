module.exports = (sequelize, Sequelize) => {
  const shoes = sequelize.define(
    "shoes",
    {
      name: Sequelize.STRING,
      description: Sequelize.STRING,
      price: Sequelize.INTEGER,
      weight: Sequelize.INTEGER,
      brand_id: {
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return shoes;
};
