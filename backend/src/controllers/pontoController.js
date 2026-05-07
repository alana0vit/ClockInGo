const pontoService = require('../services/pontoService');

async function registrarEntrada(req, res) {
    try {
        const { cpf } = req.body;

        if (!cpf) {
            return res.status(400).json({ erro: 'CPF é obrigatório' });
        }

        const { ponto, atraso } = await pontoService.registrarEntrada(cpf);

        return res.status(201).json({
            success: true,
            message: 'Entrada registrada com sucesso',
            ponto,
            atraso,
        });
    } catch (erro) {
        if (erro.message === 'FUNCIONARIO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }
        if (erro.message === 'PONTO_JA_REGISTRADO_HOJE') {
            return res.status(400).json({ erro: 'Você já registrou entrada hoje' });
        }
        console.error('Erro ao registrar entrada:', erro);
        return res.status(500).json({ erro: 'Erro interno ao registrar entrada' });
    }
}

async function registrarSaida(req, res) {
    try {
        const { cpf } = req.body;

        if (!cpf) {
            return res.status(400).json({ erro: 'CPF é obrigatório' });
        }

        const { ponto, atraso } = await pontoService.registrarSaida(cpf);

        return res.status(200).json({
            success: true,
            message: 'Saída registrada com sucesso',
            ponto,
            atraso,
        });
    } catch (erro) {
        if (erro.message === 'FUNCIONARIO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }
        if (erro.message === 'PONTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Nenhum registro de ponto encontrado hoje' });
        }
        if (erro.message === 'SAIDA_JA_REGISTRADA') {
            return res.status(400).json({ erro: 'Saída já registrada hoje' });
        }
        console.error('Erro ao registrar saída:', erro);
        return res.status(500).json({ erro: 'Erro interno ao registrar saída' });
    }
}

async function listarPontos(req, res) {
    try {
        const { cpf } = req.params;

        const pontos = await pontoService.listarPontos(cpf);

        return res.status(200).json(pontos);
    } catch (erro) {
        if (erro.message === 'FUNCIONARIO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }
        console.error('Erro ao listar pontos:', erro);
        return res.status(500).json({ erro: 'Erro interno ao listar pontos' });
    }
}

async function atualizarPonto(req, res) {
    try {
        const { id } = req.params;
        const { entrada, saida, observacao } = req.body;

        const ponto = await pontoService.atualizarPonto(id, {
            entrada,
            saida,
            observacao,
        });

        return res.status(200).json({
            success: true,
            message: 'Ponto atualizado com sucesso',
            ponto,
        });
    } catch (erro) {
        if (erro.message === 'PONTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Ponto não encontrado' });
        }
        console.error('Erro ao atualizar ponto:', erro);
        return res.status(500).json({ erro: 'Erro interno ao atualizar ponto' });
    }
}

module.exports = {
    registrarEntrada,
    registrarSaida,
    listarPontos,
    atualizarPonto,
};