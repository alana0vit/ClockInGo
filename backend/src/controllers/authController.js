const authService = require("../services/authService");

async function login(req, res) {
    try {
        const { cpf } = req.body;

        // Valida se CPF foi enviado
        if (!cpf) {
            return res.status(400).json({ erro: "CPF é obrigatório" });
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        const funcionario = await authService.login(cpfLimpo);

        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso",
            funcionario,
        });

    } catch (erro) {
        // Tratamento de erro específico
        if (erro.message === "FUNCIONARIO_NAO_ENCONTRADO") {
            return res.status(404).json({ erro: "Funcionário não encontrado" });
        }

        // Erro genérico
        console.error("Erro no login:", erro);
        return res.status(500).json({ erro: "Erro interno ao fazer login" });
    }
}

module.exports = {
    login,
};