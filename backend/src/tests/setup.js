const { sequelize } = require('../models');

// Antes de cada teste, limpa o banco
beforeEach(async () => {
    await sequelize.sync({ force: true });
});

// Depois de todos os testes, fecha conexão
afterAll(async () => {
    await sequelize.close();
});