const funcionarioService = require("../services/funcionarioService");

async function criar(req, res) {
  try {
    const funcionario = await funcionarioService.criarFuncionario(req.body);
    return res.status(201).json({
      mensagem: "Funcionário criado com sucesso",
      dados: funcionario,
    });
  } catch (error) {
    // Aqui ele pode retornar 400 por erros na regra de negócio
    return res.status(400).json({
      erro: error.message,
    });
  }
}

module.exports = {
  criar,
};
