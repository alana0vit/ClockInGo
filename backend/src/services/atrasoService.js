const { Funcionario, Ponto, Atraso } = require('../models');

class AtrasoService {
    async criarAtraso(dados) {
        const { ponto_id, tempo_minutos, tipo } = dados;

        const ponto = await Ponto.findByPk(ponto_id);
        if (!ponto) {
            throw new Error('PONTO_NAO_ENCONTRADO');
        }

        const atraso = await Atraso.create({
            ponto_id,
            tempo_minutos,
            tipo,
            justificado: false,
            motivo_justificativa: null,
        });

        return atraso;
    }

    async justificarAtraso(atrasoId, motivo) {
        if (!motivo || motivo.trim() === '') {
            throw new Error('MOTIVO_OBRIGATORIO');
        }

        const atraso = await Atraso.findByPk(atrasoId);

        if (!atraso) {
            throw new Error('ATRASO_NAO_ENCONTRADO');
        }

        atraso.justificado = true;
        atraso.motivo_justificativa = motivo;
        await atraso.save();

        return atraso;
    }

    async listarAtrasosPorFuncionario(cpf) {
        const funcionario = await Funcionario.findOne({ where: { cpf } });

        if (!funcionario) {
            throw new Error('FUNCIONARIO_NAO_ENCONTRADO');
        }

        const pontos = await Ponto.findAll({
            where: { funcionario_id: funcionario.id },
            include: [{ model: Atraso }],
        });

        const atrasos = [];
        for (const ponto of pontos) {
            if (ponto.Atrasos && ponto.Atrasos.length > 0) {
                atrasos.push(...ponto.Atrasos);
            }
        }

        return atrasos;
    }

    async listarAtrasosNaoJustificados(cpf) {
        const funcionario = await Funcionario.findOne({ where: { cpf } });

        if (!funcionario) {
            throw new Error('FUNCIONARIO_NAO_ENCONTRADO');
        }

        const pontos = await Ponto.findAll({
            where: { funcionario_id: funcionario.id },
            include: [{
                model: Atraso,
                where: { justificado: false },
                required: true,
            }],
        });

        const atrasos = [];
        for (const ponto of pontos) {
            if (ponto.Atrasos && ponto.Atrasos.length > 0) {
                atrasos.push(...ponto.Atrasos);
            }
        }

        return atrasos;
    }
}

module.exports = new AtrasoService();