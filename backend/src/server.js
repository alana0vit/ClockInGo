const app = require("./app");
const sequelize = require("./config/database");
const env = require("./config/env");

const PORT = env.port || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
