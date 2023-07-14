module.exports = (sequelize, Sequelize) => {
  const Shoe = sequelize.define(
    "Shoes",
    {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      weight: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("BESTSELLER", "DISCOUNT"),
      },
      //brand_id
      //category_id
      //subcategory_id
    },
    {
      paranoid: true,
    }
  );
  return Shoe;
};
