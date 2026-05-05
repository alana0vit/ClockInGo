require("dotenv").config;

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  db: {
    username: process.env.DB_USER || "clock_in_go_user",
    password: process.env.DB_PASSWORD || "senhaSegura123",
    database: process.env.DB_NAME || "clock_in_go_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
};
