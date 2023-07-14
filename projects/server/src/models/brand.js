module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define(
    "brands",
    {
      name: {
        type: Sequelize.STRING,
      },
      logo_img: {
        type: Sequelize.STRING,
      },
      brand_img: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return Brand;
};
