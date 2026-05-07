const sequelize = require("./config/database");

const seedEscalas = require("./seeders/escalaSeeder");
const seedDepartamentos = require("./seeders/departamentoSeeder");
const seedFuncionarios = require("./seeders/funcionarioSeeder");

async function executarSeeds() {

    try {

        await sequelize.authenticate();

        console.log("Banco conectado");

        await seedEscalas();
        await seedDepartamentos();
        await seedFuncionarios();

        console.log("Seeds executados com sucesso");

        process.exit();

    } catch (erro) {

        console.error("Erro ao executar seeds:", erro);

        process.exit(1);

    }
}

executarSeeds();