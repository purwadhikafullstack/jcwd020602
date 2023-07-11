module.exports = (sequelize, Sequelize) => {
  const shoeImgs = sequelize.define(
    "shoeImgs",
    {
      name: Sequelize.STRING,
      shoe_img: Sequelize.STRING,
      shoe_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return shoeImgs;
};
