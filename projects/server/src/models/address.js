module.exports = (sequelize, Sequelize) => {
  const addresses = sequelize.define(
    "addresses",
    {
      title: Sequelize.STRING,
      address_details: Sequelize.STRING,
      address: {
        type: Sequelize.STRING,
      },
      city_id: {
        type: Sequelize.INTEGER,
      },
      // province_id: {
      //   type: Sequelize.INTEGER,
      // },
      postcode: Sequelize.INTEGER,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      name: Sequelize.STRING,
      phone: Sequelize.STRING,
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
