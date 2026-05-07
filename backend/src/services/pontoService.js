const { Funcionario, Ponto, Atraso, Escala } = require('../models');
const { Op } = require('sequelize');

class PontoService {
    async registrarEntrada(cpf, horario = new Date()) {
        const funcionario = await Funcionario.findOne({
            where: { cpf },
            include: [{ model: Escala }],
        });

        if (!funcionario) {
            throw new Error('FUNCIONARIO_NAO_ENCONTRADO');
        }

        const hoje = horario.toISOString().split('T')[0];

        const pontoExistente = await Ponto.findOne({
            where: {
                funcionario_id: funcionario.id,
                data_registro: hoje,
            },
        });

        if (pontoExistente) {
            throw new Error('PONTO_JA_REGISTRADO_HOJE');
        }

        const ponto = await Ponto.create({
            funcionario_id: funcionario.id,
            data_registro: hoje,
            entrada: horario,
        });

        let atraso = null;

        if (funcionario.Escala) {
            const [horaEscala, minutoEscala] = funcionario.Escala.entrada.split(':');
            const horaEntradaEscala = new Date(horario);
            horaEntradaEscala.setHours(parseInt(horaEscala), parseInt(minutoEscala), 0);

            const diffMinutos = Math.floor((horario - horaEntradaEscala) / 60000);

            if (diffMinutos > funcionario.Escala.tolerancia) {
                atraso = await Atraso.create({
                    ponto_id: ponto.id,
                    tempo_minutos: diffMinutos - funcionario.Escala.tolerancia,
                    tipo: 'ENTRADA',
                });
            }
        }

        return { ponto, atraso };
    }

    async registrarSaida(cpf, horario = new Date()) {
        const funcionario = await Funcionario.findOne({
            where: { cpf },
            include: [{ model: Escala }],
        });

        if (!funcionario) {
            throw new Error('FUNCIONARIO_NAO_ENCONTRADO');
        }

        const hoje = horario.toISOString().split('T')[0];

        const ponto = await Ponto.findOne({
            where: {
                funcionario_id: funcionario.id,
                data_registro: hoje,
            },
        });

        if (!ponto) {
            throw new Error('PONTO_NAO_ENCONTRADO');
        }

        if (ponto.saida) {
            throw new Error('SAIDA_JA_REGISTRADA');
        }

        ponto.saida = horario;
        await ponto.save();

        let atraso = null;

        if (funcionario.Escala && ponto.saida) {
            const [horaEscala, minutoEscala] = funcionario.Escala.saida.split(':');
            const horaSaidaEscala = new Date(horario);
            horaSaidaEscala.setHours(parseInt(horaEscala), parseInt(minutoEscala), 0);

            const diffMinutos = Math.floor((horaSaidaEscala - ponto.saida) / 60000);

            if (diffMinutos > 0) {
                atraso = await Atraso.create({
                    ponto_id: ponto.id,
                    tempo_minutos: diffMinutos,
                    tipo: 'SAIDA_ANTECIPADA',
                });
            }
        }

        return { ponto, atraso };
    }

    async listarPontos(cpf) {
        const funcionario = await Funcionario.findOne({ where: { cpf } });

        if (!funcionario) {
            throw new Error('FUNCIONARIO_NAO_ENCONTRADO');
        }

        return await Ponto.findAll({
            where: { funcionario_id: funcionario.id },
            include: [{ model: Atraso }],
            order: [['data_registro', 'DESC']],
        });
    }

    async atualizarPonto(id, dados) {
        const ponto = await Ponto.findByPk(id);

        if (!ponto) {
            throw new Error('PONTO_NAO_ENCONTRADO');
        }

        await ponto.update(dados);
        return ponto;
    }
}

module.exports = new PontoService();