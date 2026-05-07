const { Funcionario } = require("../models");

async function login(cpf) {
    // Busca o funcionário pelo CPF
    const funcionario = await Funcionario.findOne({
        where: { cpf },
        attributes: ['id', 'nome', 'cpf', 'email'], // só retorna esses campos
    });

    if (!funcionario) {
        throw new Error("FUNCIONARIO_NAO_ENCONTRADO");
    }

    return funcionario;
}

module.exports = {
    login,
};