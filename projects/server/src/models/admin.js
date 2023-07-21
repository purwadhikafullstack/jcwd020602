module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("Admins", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    warehouse_id: {
      type: Sequelize.INTEGER,
    },
  });
  return Admin;
};
