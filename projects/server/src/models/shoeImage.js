module.exports = (sequelize, Sequelize) => {
  const ShoeImage = sequelize.define(
    "ShoeImages",
    {
      shoe_img: {
        type: Sequelize.STRING,
      },
      //   shoe_id
    },
    {
      paranoid: true,
    }
  );
  return ShoeImage;
};
