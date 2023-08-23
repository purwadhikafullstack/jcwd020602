module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "Categories",
    {
      name: {
        type: Sequelize.STRING,
      },

      category_img: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return Category;
};
