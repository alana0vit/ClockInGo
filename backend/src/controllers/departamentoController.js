const departamentoService = require('../services/departamentoService');

async function criarDepartamento(req, res) {
    try {
        const { nome, sigla } = req.body;

        if (!nome) {
            return res.status(400).json({ erro: 'Nome do departamento é obrigatório' });
        }

        if (!sigla) {
            return res.status(400).json({ erro: 'Sigla do departamento é obrigatória' });
        }

        const departamento = await departamentoService.criarDepartamento({ nome, sigla });

        return res.status(201).json({
            success: true,
            message: 'Departamento criado com sucesso',
            departamento
        });
    } catch (erro) {
        if (erro.message === 'DEPARTAMENTO_JA_EXISTE') {
            return res.status(409).json({ erro: 'Departamento com este nome ou sigla já existe' });
        }
        console.error('Erro ao criar departamento:', erro);
        return res.status(500).json({ erro: 'Erro interno ao criar departamento' });
    }
}

async function listarDepartamentos(req, res) {
    try {
        const departamentos = await departamentoService.listarDepartamentos();
        return res.status(200).json(departamentos);
    } catch (erro) {
        console.error('Erro ao listar departamentos:', erro);
        return res.status(500).json({ erro: 'Erro interno ao listar departamentos' });
    }
}

async function buscarDepartamentoPorId(req, res) {
    try {
        const { id } = req.params;
        const departamento = await departamentoService.buscarDepartamentoPorId(id);
        return res.status(200).json(departamento);
    } catch (erro) {
        if (erro.message === 'DEPARTAMENTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Departamento não encontrado' });
        }
        console.error('Erro ao buscar departamento:', erro);
        return res.status(500).json({ erro: 'Erro interno ao buscar departamento' });
    }
}

async function atualizarDepartamento(req, res) {
    try {
        const { id } = req.params;
        const { nome, sigla } = req.body;

        const departamento = await departamentoService.atualizarDepartamento(id, { nome, sigla });

        return res.status(200).json({
            success: true,
            message: 'Departamento atualizado com sucesso',
            departamento
        });
    } catch (erro) {
        if (erro.message === 'DEPARTAMENTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Departamento não encontrado' });
        }
        console.error('Erro ao atualizar departamento:', erro);
        return res.status(500).json({ erro: 'Erro interno ao atualizar departamento' });
    }
}

async function deletarDepartamento(req, res) {
    try {
        const { id } = req.params;
        await departamentoService.deletarDepartamento(id);
        return res.status(204).send();
    } catch (erro) {
        if (erro.message === 'DEPARTAMENTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Departamento não encontrado' });
        }
        console.error('Erro ao deletar departamento:', erro);
        return res.status(500).json({ erro: 'Erro interno ao deletar departamento' });
    }
}

module.exports = {
    criarDepartamento,
    listarDepartamentos,
    buscarDepartamentoPorId,
    atualizarDepartamento,
    deletarDepartamento
};