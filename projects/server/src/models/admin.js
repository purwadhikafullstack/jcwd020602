module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("Admins");
  return Admin;
};
