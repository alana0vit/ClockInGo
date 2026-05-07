const escalaService = require('../services/escalaService');

async function criarEscala(req, res) {
    try {
        const { nome, entrada, saida, tolerancia } = req.body;

        if (!nome) {
            return res.status(400).json({ erro: 'Nome da escala é obrigatório' });
        }

        if (!entrada) {
            return res.status(400).json({ erro: 'Horário de entrada é obrigatório' });
        }

        if (!saida) {
            return res.status(400).json({ erro: 'Horário de saída é obrigatório' });
        }

        const escala = await escalaService.criarEscala({ nome, entrada, saida, tolerancia });

        return res.status(201).json({
            success: true,
            message: 'Escala criada com sucesso',
            escala
        });
    } catch (erro) {
        if (erro.message === 'ESCALA_JA_EXISTE') {
            return res.status(409).json({ erro: 'Já existe uma escala com este nome' });
        }
        console.error('Erro ao criar escala:', erro);
        return res.status(500).json({ erro: 'Erro interno ao criar escala' });
    }
}

async function listarEscalas(req, res) {
    try {
        const escalas = await escalaService.listarEscalas();
        return res.status(200).json(escalas);
    } catch (erro) {
        console.error('Erro ao listar escalas:', erro);
        return res.status(500).json({ erro: 'Erro interno ao listar escalas' });
    }
}

async function buscarEscalaPorId(req, res) {
    try {
        const { id } = req.params;
        const escala = await escalaService.buscarEscalaPorId(id);
        return res.status(200).json(escala);
    } catch (erro) {
        if (erro.message === 'ESCALA_NAO_ENCONTRADA') {
            return res.status(404).json({ erro: 'Escala não encontrada' });
        }
        console.error('Erro ao buscar escala:', erro);
        return res.status(500).json({ erro: 'Erro interno ao buscar escala' });
    }
}

async function atualizarEscala(req, res) {
    try {
        const { id } = req.params;
        const { nome, entrada, saida, tolerancia } = req.body;

        const escala = await escalaService.atualizarEscala(id, { nome, entrada, saida, tolerancia });

        return res.status(200).json({
            success: true,
            message: 'Escala atualizada com sucesso',
            escala
        });
    } catch (erro) {
        if (erro.message === 'ESCALA_NAO_ENCONTRADA') {
            return res.status(404).json({ erro: 'Escala não encontrada' });
        }
        console.error('Erro ao atualizar escala:', erro);
        return res.status(500).json({ erro: 'Erro interno ao atualizar escala' });
    }
}

async function deletarEscala(req, res) {
    try {
        const { id } = req.params;
        await escalaService.deletarEscala(id);
        return res.status(204).send();
    } catch (erro) {
        if (erro.message === 'ESCALA_NAO_ENCONTRADA') {
            return res.status(404).json({ erro: 'Escala não encontrada' });
        }
        if (erro.message === 'ESCALA_POSSUI_FUNCIONARIOS') {
            return res.status(409).json({ erro: 'Não é possível deletar esta escala pois existem funcionários vinculados a ela' });
        }
        console.error('Erro ao deletar escala:', erro);
        return res.status(500).json({ erro: 'Erro interno ao deletar escala' });
    }
}

module.exports = {
    criarEscala,
    listarEscalas,
    buscarEscalaPorId,
    atualizarEscala,
    deletarEscala
};