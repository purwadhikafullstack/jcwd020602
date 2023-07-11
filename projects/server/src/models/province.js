module.exports = (sequelize, Sequelize) => {
  const provinces = sequelize.define(
    "provinces",
    {
      province_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      province: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return provinces;
};
