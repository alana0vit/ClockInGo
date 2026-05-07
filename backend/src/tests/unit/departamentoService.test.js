const departamentoService = require('../../services/departamentoService');
const { Departamento, sequelize } = require('../../models');

describe('DepartamentoService - TDD', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('criarDepartamento()', () => {
        it('deve criar um departamento com sucesso', async () => {
            const resultado = await departamentoService.criarDepartamento({
                nome: 'Tecnologia da Informação',
                sigla: 'TI'
            });

            expect(resultado).toHaveProperty('id');
            expect(resultado.nome).toBe('Tecnologia da Informação');
            expect(resultado.sigla).toBe('TI');
        });

        it('deve lançar erro NOME_OBRIGATORIO quando nome não informado', async () => {
            await expect(departamentoService.criarDepartamento({
                sigla: 'TI'
            })).rejects.toThrow('NOME_OBRIGATORIO');
        });

        it('deve lançar erro SIGLA_OBRIGATORIA quando sigla não informada', async () => {
            await expect(departamentoService.criarDepartamento({
                nome: 'Tecnologia'
            })).rejects.toThrow('SIGLA_OBRIGATORIA');
        });

        it('deve lançar erro DEPARTAMENTO_JA_EXISTE quando nome duplicado', async () => {
            await departamentoService.criarDepartamento({
                nome: 'RH',
                sigla: 'RH'
            });

            await expect(departamentoService.criarDepartamento({
                nome: 'RH',
                sigla: 'RH2'
            })).rejects.toThrow('DEPARTAMENTO_JA_EXISTE');
        });
    });

    describe('listarDepartamentos()', () => {
        it('deve retornar lista de todos os departamentos', async () => {
            await departamentoService.criarDepartamento({ nome: 'TI', sigla: 'TI' });
            await departamentoService.criarDepartamento({ nome: 'RH', sigla: 'RH' });

            const departamentos = await departamentoService.listarDepartamentos();

            expect(departamentos.length).toBe(2);
            expect(departamentos[0]).toHaveProperty('nome');
            expect(departamentos[0]).toHaveProperty('sigla');
        });

        it('deve retornar array vazio quando não há departamentos', async () => {
            const departamentos = await departamentoService.listarDepartamentos();
            expect(departamentos).toEqual([]);
        });
    });

    describe('buscarDepartamentoPorId()', () => {
        it('deve retornar departamento pelo ID', async () => {
            const criado = await departamentoService.criarDepartamento({
                nome: 'Financeiro',
                sigla: 'FIN'
            });

            const encontrado = await departamentoService.buscarDepartamentoPorId(criado.id);

            expect(encontrado.nome).toBe('Financeiro');
            expect(encontrado.sigla).toBe('FIN');
        });

        it('deve lançar erro DEPARTAMENTO_NAO_ENCONTRADO para ID inválido', async () => {
            await expect(departamentoService.buscarDepartamentoPorId(999))
                .rejects.toThrow('DEPARTAMENTO_NAO_ENCONTRADO');
        });
    });

    describe('atualizarDepartamento()', () => {
        let departamento;

        beforeEach(async () => {
            departamento = await departamentoService.criarDepartamento({
                nome: 'Vendas',
                sigla: 'VND'
            });
        });

        it('deve atualizar nome do departamento', async () => {
            const atualizado = await departamentoService.atualizarDepartamento(departamento.id, {
                nome: 'Vendas e Marketing'
            });

            expect(atualizado.nome).toBe('Vendas e Marketing');
        });

        it('deve atualizar sigla do departamento', async () => {
            const atualizado = await departamentoService.atualizarDepartamento(departamento.id, {
                sigla: 'MKT'
            });

            expect(atualizado.sigla).toBe('MKT');
        });

        it('deve lançar erro DEPARTAMENTO_NAO_ENCONTRADO para ID inválido', async () => {
            await expect(departamentoService.atualizarDepartamento(999, { nome: 'Teste' }))
                .rejects.toThrow('DEPARTAMENTO_NAO_ENCONTRADO');
        });
    });

    describe('deletarDepartamento()', () => {
        it('deve deletar departamento com sucesso', async () => {
            const departamento = await departamentoService.criarDepartamento({
                nome: 'Logística',
                sigla: 'LOG'
            });

            await departamentoService.deletarDepartamento(departamento.id);

            await expect(departamentoService.buscarDepartamentoPorId(departamento.id))
                .rejects.toThrow('DEPARTAMENTO_NAO_ENCONTRADO');
        });

        it('deve lançar erro DEPARTAMENTO_NAO_ENCONTRADO para ID inválido', async () => {
            await expect(departamentoService.deletarDepartamento(999))
                .rejects.toThrow('DEPARTAMENTO_NAO_ENCONTRADO');
        });
    });
});