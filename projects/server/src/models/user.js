module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      avatar_url: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("verified", "unverified"),
        defaultValue: "unverified",
      },
      assign: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: Sequelize.ENUM("USER", "ADMIN", "SUPERADMIN"),
      },
      providerId: {
        type: Sequelize.STRING,
      },
    },
    {
      indexes: [{ unique: true, fields: ["email"] }],
    },
    {
      paranoid: true,
    }
  );
  return users;
};
