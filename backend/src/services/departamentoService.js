const { Departamento } = require('../models');
const { Op } = require('sequelize');

class DepartamentoService {
    async criarDepartamento(dados) {
        const { nome, sigla } = dados;

        if (!nome || nome.trim() === '') {
            throw new Error('NOME_OBRIGATORIO');
        }

        if (!sigla || sigla.trim() === '') {
            throw new Error('SIGLA_OBRIGATORIA');
        }

        const existente = await Departamento.findOne({
            where: {
                [Op.or]: [
                    { nome },
                    { sigla }
                ]
            }
        });

        if (existente) {
            throw new Error('DEPARTAMENTO_JA_EXISTE');
        }

        return await Departamento.create({ nome, sigla });
    }

    async listarDepartamentos() {
        return await Departamento.findAll({
            order: [['nome', 'ASC']]
        });
    }

    async buscarDepartamentoPorId(id) {
        const departamento = await Departamento.findByPk(id);

        if (!departamento) {
            throw new Error('DEPARTAMENTO_NAO_ENCONTRADO');
        }

        return departamento;
    }

    async atualizarDepartamento(id, dados) {
        const departamento = await this.buscarDepartamentoPorId(id);

        if (dados.nome) {
            departamento.nome = dados.nome;
        }

        if (dados.sigla) {
            departamento.sigla = dados.sigla;
        }

        await departamento.save();
        return departamento;
    }

    async deletarDepartamento(id) {
        const departamento = await this.buscarDepartamentoPorId(id);
        await departamento.destroy();
        return { message: 'Departamento deletado com sucesso' };
    }
}

module.exports = new DepartamentoService();