module.exports = (sequelize, Sequelize) => {
  const addresses = sequelize.define(
    "addresses",
    {
      title: Sequelize.STRING,
      address: Sequelize.STRING,
      address_details: Sequelize.STRING,
      road: Sequelize.STRING,
      district: Sequelize.STRING,
      city: Sequelize.STRING,
      province: Sequelize.STRING,
      postcode: Sequelize.INTEGER,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      recipient: Sequelize.STRING,
      phone_number: Sequelize.STRING,
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
