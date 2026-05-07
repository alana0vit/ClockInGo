const escalaService = require('../../services/escalaService');
const { Escala, sequelize } = require('../../models');

describe('EscalaService - TDD', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('criarEscala()', () => {
        it('deve criar uma escala com sucesso', async () => {
            const resultado = await escalaService.criarEscala({
                nome: 'Comercial',
                entrada: '08:00:00',
                saida: '17:00:00',
                tolerancia: 15
            });

            expect(resultado).toHaveProperty('id');
            expect(resultado.nome).toBe('Comercial');
            expect(resultado.entrada).toBe('08:00:00');
            expect(resultado.saida).toBe('17:00:00');
            expect(resultado.tolerancia).toBe(15);
        });

        it('deve criar escala com tolerância padrão quando não informada', async () => {
            const resultado = await escalaService.criarEscala({
                nome: 'Administrativo',
                entrada: '09:00:00',
                saida: '18:00:00'
            });

            expect(resultado.tolerancia).toBe(15); // valor padrão
        });

        it('deve lançar erro NOME_OBRIGATORIO quando nome não informado', async () => {
            await expect(escalaService.criarEscala({
                entrada: '08:00:00',
                saida: '17:00:00'
            })).rejects.toThrow('NOME_OBRIGATORIO');
        });

        it('deve lançar erro ENTRADA_OBRIGATORIA quando entrada não informada', async () => {
            await expect(escalaService.criarEscala({
                nome: 'Comercial',
                saida: '17:00:00'
            })).rejects.toThrow('ENTRADA_OBRIGATORIA');
        });

        it('deve lançar erro SAIDA_OBRIGATORIA quando saida não informada', async () => {
            await expect(escalaService.criarEscala({
                nome: 'Comercial',
                entrada: '08:00:00'
            })).rejects.toThrow('SAIDA_OBRIGATORIA');
        });

        it('deve lançar erro ESCALA_JA_EXISTE quando nome duplicado', async () => {
            await escalaService.criarEscala({
                nome: 'Noturno',
                entrada: '22:00:00',
                saida: '06:00:00'
            });

            await expect(escalaService.criarEscala({
                nome: 'Noturno',
                entrada: '23:00:00',
                saida: '07:00:00'
            })).rejects.toThrow('ESCALA_JA_EXISTE');
        });
    });

    describe('listarEscalas()', () => {
        it('deve retornar lista de todas as escalas', async () => {
            await escalaService.criarEscala({ nome: 'Manhã', entrada: '08:00:00', saida: '12:00:00' });
            await escalaService.criarEscala({ nome: 'Tarde', entrada: '13:00:00', saida: '17:00:00' });

            const escalas = await escalaService.listarEscalas();

            expect(escalas.length).toBe(2);
            expect(escalas[0]).toHaveProperty('nome');
            expect(escalas[0]).toHaveProperty('entrada');
            expect(escalas[0]).toHaveProperty('saida');
        });

        it('deve retornar array vazio quando não há escalas', async () => {
            const escalas = await escalaService.listarEscalas();
            expect(escalas).toEqual([]);
        });
    });

    describe('buscarEscalaPorId()', () => {
        it('deve retornar escala pelo ID', async () => {
            const criada = await escalaService.criarEscala({
                nome: 'Integral',
                entrada: '08:00:00',
                saida: '18:00:00',
                tolerancia: 30
            });

            const encontrada = await escalaService.buscarEscalaPorId(criada.id);

            expect(encontrada.nome).toBe('Integral');
            expect(encontrada.tolerancia).toBe(30);
        });

        it('deve lançar erro ESCALA_NAO_ENCONTRADA para ID inválido', async () => {
            await expect(escalaService.buscarEscalaPorId(999))
                .rejects.toThrow('ESCALA_NAO_ENCONTRADA');
        });
    });

    describe('atualizarEscala()', () => {
        let escala;

        beforeEach(async () => {
            escala = await escalaService.criarEscala({
                nome: 'Meio Período',
                entrada: '08:00:00',
                saida: '12:00:00',
                tolerancia: 10
            });
        });

        it('deve atualizar nome da escala', async () => {
            const atualizada = await escalaService.atualizarEscala(escala.id, {
                nome: 'Meio Período Matutino'
            });

            expect(atualizada.nome).toBe('Meio Período Matutino');
        });

        it('deve atualizar horário de entrada', async () => {
            const atualizada = await escalaService.atualizarEscala(escala.id, {
                entrada: '09:00:00'
            });

            expect(atualizada.entrada).toBe('09:00:00');
        });

        it('deve atualizar horário de saída', async () => {
            const atualizada = await escalaService.atualizarEscala(escala.id, {
                saida: '13:00:00'
            });

            expect(atualizada.saida).toBe('13:00:00');
        });

        it('deve atualizar tolerância', async () => {
            const atualizada = await escalaService.atualizarEscala(escala.id, {
                tolerancia: 20
            });

            expect(atualizada.tolerancia).toBe(20);
        });

        it('deve lançar erro ESCALA_NAO_ENCONTRADA para ID inválido', async () => {
            await expect(escalaService.atualizarEscala(999, { nome: 'Teste' }))
                .rejects.toThrow('ESCALA_NAO_ENCONTRADA');
        });
    });

    describe('deletarEscala()', () => {
        it('deve deletar escala com sucesso', async () => {
            const escala = await escalaService.criarEscala({
                nome: 'Para Deletar',
                entrada: '10:00:00',
                saida: '16:00:00'
            });

            await escalaService.deletarEscala(escala.id);

            await expect(escalaService.buscarEscalaPorId(escala.id))
                .rejects.toThrow('ESCALA_NAO_ENCONTRADA');
        });

        it('deve lançar erro ESCALA_NAO_ENCONTRADA para ID inválido', async () => {
            await expect(escalaService.deletarEscala(999))
                .rejects.toThrow('ESCALA_NAO_ENCONTRADA');
        });

        it('deve lançar erro ESCALA_POSSUI_FUNCIONARIOS ao tentar deletar escala com vínculos', async () => {
            const { Funcionario } = require('../../models');

            const escala = await escalaService.criarEscala({
                nome: 'Com Vínculo',
                entrada: '08:00:00',
                saida: '17:00:00'
            });

            await Funcionario.create({
                cpf: '12345678901',
                nome: 'Funcionário Vinculado',
                email: 'vinculado@empresa.com',
                escala_id: escala.id
            });

            await expect(escalaService.deletarEscala(escala.id))
                .rejects.toThrow('ESCALA_POSSUI_FUNCIONARIOS');
        });
    });
});