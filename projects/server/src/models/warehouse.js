module.exports = (sequelize, Sequelize) => {
  const warehouses = sequelize.define(
    "warehouses",
    {
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      city_id: {
        type: Sequelize.INTEGER,
      },
      postcode: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return warehouses;
};
