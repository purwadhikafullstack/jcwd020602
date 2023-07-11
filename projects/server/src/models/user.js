module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: Sequelize.STRING,
      full_name: Sequelize.STRING,
      profile_picture: Sequelize.STRING,
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role: Sequelize.ENUM("USER", "WAREHOUSE_ADMIN", "SUPER_ADMIN"),
      warehouse_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return users;
};
