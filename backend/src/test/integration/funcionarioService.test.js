const funcionarioService = require("../../services/funcionarioService");
const { Departamento, Funcionario, sequelize } = require("../../models");

describe("Funcionário Service - Integração", () => {
  let departamentoTeste;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Isso aqui vai resetar as tabelas pro teste

    departamentoTeste = await Departamento.create({
      nome: "Tecnologia da Informação",
      sigla: "TI",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve lançar erro ao tentar criar funcionário sem departamento", async () => {
    const dadosInvalidos = {
      cpf: "10987654321",
      nome: "Maria Sem Setor",
      email: "maria@clockingo.com",
      departamento_id: 9999, // ID inexistente
    };

    await expect(
      funcionarioService.criarFuncionario(dadosInvalidos),
    ).rejects.toThrow("Departamento não encontrado");
  });

  it("Deve criar um funcionário com sucesso", async () => {
    const dadosFuncionario = {
      cpf: "12345678901",
      nome: "José Maria do Exemplo",
      email: "jme.email@clockingo.com",
      departamento_id: departamentoTeste.id,
    };

    const funcionario =
      await funcionarioService.criarFuncionario(dadosFuncionario);

    expect(funcionario).toHaveProperty("id");
    expect(funcionario.nome).toBe("José Maria do Exemplo");
    expect(funcionario.departamento_id).toBe(departamentoTeste.id);
  });
});
