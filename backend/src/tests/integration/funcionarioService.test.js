const funcionarioService = require("../../services/funcionarioService");
const { Departamento, Funcionario, sequelize } = require("../../models");

describe("Funcionario Service - Integração (Busca)", () => {
  let funcionarioExistente;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const depto = await Departamento.create({ nome: "TI", sigla: "TI" });

    // Criamos um funcionário manualmente para simular que ele "já existe" no banco
    funcionarioExistente = await Funcionario.create({
      cpf: "11122233344",
      nome: "Funcionario Antigo",
      email: "antigo@empresa.com",
      departamento_id: depto.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve encontrar um funcionário que já existe no banco", async () => {
    const funcionario = await funcionarioService.buscarFuncionarioPorId(
      funcionarioExistente.id,
    );
    expect(funcionario.cpf).toBe("11122233344");
  });

  it("Deve lançar erro ao buscar ID inexistente", async () => {
    await expect(
      funcionarioService.buscarFuncionarioPorId(999),
    ).rejects.toThrow("Funcionário não encontrado na base de dados");
  });
});
