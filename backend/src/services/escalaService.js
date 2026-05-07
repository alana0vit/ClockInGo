const { Escala, Funcionario } = require('../models');
const { Op } = require('sequelize');

class EscalaService {
    async criarEscala(dados) {
        const { nome, entrada, saida, tolerancia } = dados;

        if (!nome || nome.trim() === '') {
            throw new Error('NOME_OBRIGATORIO');
        }

        if (!entrada) {
            throw new Error('ENTRADA_OBRIGATORIA');
        }

        if (!saida) {
            throw new Error('SAIDA_OBRIGATORIA');
        }

        const existente = await Escala.findOne({
            where: { nome }
        });

        if (existente) {
            throw new Error('ESCALA_JA_EXISTE');
        }

        return await Escala.create({
            nome,
            entrada,
            saida,
            tolerancia: tolerancia || 15
        });
    }

    async listarEscalas() {
        return await Escala.findAll({
            order: [['nome', 'ASC']]
        });
    }

    async buscarEscalaPorId(id) {
        const escala = await Escala.findByPk(id);

        if (!escala) {
            throw new Error('ESCALA_NAO_ENCONTRADA');
        }

        return escala;
    }

    async atualizarEscala(id, dados) {
        const escala = await this.buscarEscalaPorId(id);

        if (dados.nome !== undefined) {
            escala.nome = dados.nome;
        }

        if (dados.entrada !== undefined) {
            escala.entrada = dados.entrada;
        }

        if (dados.saida !== undefined) {
            escala.saida = dados.saida;
        }

        if (dados.tolerancia !== undefined) {
            escala.tolerancia = dados.tolerancia;
        }

        await escala.save();
        return escala;
    }

    async deletarEscala(id) {
        const escala = await this.buscarEscalaPorId(id);

        // Verificar se existem funcionários vinculados a esta escala
        const funcionariosVinculados = await Funcionario.count({
            where: { escala_id: id }
        });

        if (funcionariosVinculados > 0) {
            throw new Error('ESCALA_POSSUI_FUNCIONARIOS');
        }

        await escala.destroy();
        return { message: 'Escala deletada com sucesso' };
    }
}

module.exports = new EscalaService();