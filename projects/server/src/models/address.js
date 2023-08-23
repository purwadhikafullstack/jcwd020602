module.exports = (sequelize, Sequelize) => {
  const addresses = sequelize.define(
    "addresses",
    {
      title: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      address_details: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      city_id: {
        type: Sequelize.INTEGER,
      },
      postcode: Sequelize.INTEGER,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      is_primary: Sequelize.BOOLEAN,
      user_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return addresses;
};
