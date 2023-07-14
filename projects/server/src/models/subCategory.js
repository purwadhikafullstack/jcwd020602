module.exports = (sequelize, Sequelize) => {
  const Subcategory = sequelize.define(
    "subcategories",
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return Subcategory;
};
