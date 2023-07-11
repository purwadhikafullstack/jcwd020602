module.exports = (sequelize, Sequelize) => {
  const shoeSizes = sequelize.define(
    "shoeSizes",
    {
      name: Sequelize.STRING,
      size: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return shoeSizes;
};
