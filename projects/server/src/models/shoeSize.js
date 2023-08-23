module.exports = (sequelize, Sequelize) => {
  const shoeSizes = sequelize.define(
    "shoeSizes",
    {
      size: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return shoeSizes;
};
