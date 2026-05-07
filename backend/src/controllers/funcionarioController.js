const funcionarioService = require("../services/funcionarioService");

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const funcionario = await funcionarioService.buscarFuncionarioPorId(id);

    return res.status(200).json(funcionario);
  } catch (erro) {
    const status =
      erro.message === "Funcionário não encontrado na base de dados"
        ? 404
        : 500;
    return res.status(status).json({ erro: erro.message });
  }
}

module.exports = {
  buscarPorId,
};
