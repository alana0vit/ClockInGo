const { Funcionario, Departamento } = require("../models");
const { Op } = require("sequelize");

async function criarFuncionario(dadosFuncionario) {
  const { cpf, nome, email, departamento_id, escala_id, endereco } =
    dadosFuncionario;

  // Campos obirgatórios
  if (!cpf || !nome || !email || !departamento_id) {
    throw new Error(
      "Campos obrigatórios faltando: cpf, nome, email ou departamento_id",
    );
  }

  // Vê se o departamento já existe
  const departamento = await Departamento.findByPk(departamento_id);
  if (!departamento) {
    throw new Error("Departamento não encontrado");
  }

  // Se o CPF ou email duplicados
  const existente = await Funcionario.findOne({
    where: {
      [Op.or]: [{ cpf: cpf }, { email: email }],
    },
  });

  if (existente) {
    throw new Error("Funcionário já está cadastrado");
  }

  const novoFuncionario = await Funcionario.create({
    cpf,
    nome,
    email,
    endereco,
    departamento_id,
    escala_id,
  });

  return novoFuncionario;
}

module.exports = {
  criarFuncionario,
};
