module.exports = (sequelize, Sequelize) => {
  const brands = sequelize.define(
    "brands",
    {
      name: Sequelize.STRING,
      logo_img: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return brands;
};
