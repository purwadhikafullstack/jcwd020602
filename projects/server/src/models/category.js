module.exports = (sequelize, Sequelize) => {
  const categories = sequelize.define(
    "categories",
    {
      name: Sequelize.STRING,
      description: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return categories;
};
