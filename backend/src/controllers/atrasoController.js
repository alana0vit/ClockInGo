const atrasoService = require('../services/atrasoService');

async function justificarAtraso(req, res) {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        if (!motivo) {
            return res.status(400).json({ erro: 'Motivo da justificativa é obrigatório' });
        }

        const atraso = await atrasoService.justificarAtraso(id, motivo);

        return res.status(200).json({
            success: true,
            message: 'Atraso justificado com sucesso',
            atraso,
        });
    } catch (erro) {
        if (erro.message === 'ATRASO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Atraso não encontrado' });
        }
        if (erro.message === 'MOTIVO_OBRIGATORIO') {
            return res.status(400).json({ erro: 'Motivo da justificativa é obrigatório' });
        }
        console.error('Erro ao justificar atraso:', erro);
        return res.status(500).json({ erro: 'Erro interno ao justificar atraso' });
    }
}

async function listarAtrasosPorFuncionario(req, res) {
    try {
        const { cpf } = req.params;
        const atrasos = await atrasoService.listarAtrasosPorFuncionario(cpf);

        return res.status(200).json(atrasos);
    } catch (erro) {
        if (erro.message === 'FUNCIONARIO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }
        console.error('Erro ao listar atrasos:', erro);
        return res.status(500).json({ erro: 'Erro interno ao listar atrasos' });
    }
}

async function listarAtrasosNaoJustificados(req, res) {
    try {
        const { cpf } = req.params;
        const atrasos = await atrasoService.listarAtrasosNaoJustificados(cpf);

        return res.status(200).json(atrasos);
    } catch (erro) {
        if (erro.message === 'FUNCIONARIO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }
        console.error('Erro ao listar atrasos não justificados:', erro);
        return res.status(500).json({ erro: 'Erro interno ao listar atrasos' });
    }
}

async function criarAtraso(req, res) {
    try {
        const { ponto_id, tempo_minutos, tipo } = req.body;

        if (!ponto_id) {
            return res.status(400).json({ erro: 'ID do ponto é obrigatório' });
        }

        if (!tempo_minutos || tempo_minutos <= 0) {
            return res.status(400).json({ erro: 'Tempo em minutos é obrigatório e deve ser maior que zero' });
        }

        if (!tipo || !['ENTRADA', 'SAIDA_ANTECIPADA'].includes(tipo)) {
            return res.status(400).json({ erro: 'Tipo deve ser ENTRADA ou SAIDA_ANTECIPADA' });
        }

        const atraso = await atrasoService.criarAtraso({
            ponto_id,
            tempo_minutos,
            tipo,
        });

        return res.status(201).json({
            success: true,
            message: 'Atraso registrado com sucesso',
            atraso,
        });
    } catch (erro) {
        if (erro.message === 'PONTO_NAO_ENCONTRADO') {
            return res.status(404).json({ erro: 'Ponto não encontrado' });
        }
        console.error('Erro ao criar atraso:', erro);
        return res.status(500).json({ erro: 'Erro interno ao criar atraso' });
    }
}

module.exports = {
    justificarAtraso,
    listarAtrasosPorFuncionario,
    listarAtrasosNaoJustificados,
    criarAtraso,
};