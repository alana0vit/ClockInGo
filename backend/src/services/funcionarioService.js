const { Funcionario, Departamento } = require("../models");

async function buscarFuncionarioPorId(id) {
  const funcionario = await Funcionario.findByPk(id, {
    include: [{ model: Departamento }],
  });

  if (!funcionario) {
    throw new Error("Funcionário não encontrado na base de dados");
  }

  return funcionario;
}

module.exports = {
  buscarFuncionarioPorId,
};
