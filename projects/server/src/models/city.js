module.exports = (sequelize, Sequelize) => {
  const cities = sequelize.define(
    "cities",
    {
      city_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      province_id: {
        type: Sequelize.INTEGER,
      },
      province: Sequelize.STRING,
      type: Sequelize.STRING,
      city_name: Sequelize.STRING,
      postal_code: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return cities;
};
