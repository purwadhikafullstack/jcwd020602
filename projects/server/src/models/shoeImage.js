module.exports = (sequelize, Sequelize) => {
  const Shoeimage = sequelize.define(
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
  return Shoeimage;
};
