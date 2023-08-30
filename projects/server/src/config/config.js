const { db_username, db_password, db_database, db_host, db_dialect } =
  process.env;
module.exports = {
  development: {
    username: db_username,
    password: db_password,
    database: db_database,
    host: db_host,
    dialect: db_dialect,
  },
  production: {
    username: db_username, //"root",
    password: db_password, //"password",
    database: db_database, //
    host: db_host, // "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 2,
      idle: 30000,
      acquire: 60000,
    },
  },
};
