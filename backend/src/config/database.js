const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(
    env.db.database,
    env.db.username,
    env.db.password,
    {
        host: env.db.host,
        port: env.db.port,
        dialect: env.db.dialect,
        logging: env.nodeEnv === "development" ? console.log : false,
        define: {
            userscored: true,
            timestamps: true, 
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = sequelize;
