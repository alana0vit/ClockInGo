const atrasoService = require('../../services/atrasoService');
const { Funcionario, Escala, Ponto, Atraso, sequelize } = require('../../models');

describe('AtrasoService - TDD', () => {
    let funcionario;
    let escala;
    let ponto;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        escala = await Escala.create({
            nome: 'Comercial',
            entrada: '08:00:00',
            saida: '17:00:00',
            tolerancia: 15,
        });

        funcionario = await Funcionario.create({
            cpf: '12345678901',
            nome: 'João Silva',
            email: 'joao@empresa.com',
            escala_id: escala.id,
        });

        // Criar ponto com atraso na entrada
        const horarioAtrasado = new Date();
        horarioAtrasado.setHours(8, 20, 0);

        ponto = await Ponto.create({
            funcionario_id: funcionario.id,
            data_registro: horarioAtrasado.toISOString().split('T')[0],
            entrada: horarioAtrasado,
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('criarAtraso()', () => {
        it('deve criar um atraso do tipo ENTRADA', async () => {
            const atraso = await atrasoService.criarAtraso({
                ponto_id: ponto.id,
                tempo_minutos: 5,
                tipo: 'ENTRADA'
            });

            expect(atraso).toHaveProperty('id');
            expect(atraso.tempo_minutos).toBe(5);
            expect(atraso.tipo).toBe('ENTRADA');
            expect(atraso.justificado).toBe(false);
        });

        it('deve criar um atraso do tipo SAIDA_ANTECIPADA', async () => {
            const atraso = await atrasoService.criarAtraso({
                ponto_id: ponto.id,
                tempo_minutos: 30,
                tipo: 'SAIDA_ANTECIPADA'
            });

            expect(atraso.tipo).toBe('SAIDA_ANTECIPADA');
            expect(atraso.tempo_minutos).toBe(30);
        });

        it('deve lançar erro PONTO_NAO_ENCONTRADO quando ponto não existe', async () => {
            await expect(atrasoService.criarAtraso({
                ponto_id: 99999,
                tempo_minutos: 5,
                tipo: 'ENTRADA'
            })).rejects.toThrow('PONTO_NAO_ENCONTRADO');
        });
    });

    describe('justificarAtraso()', () => {
        let atraso;

        beforeEach(async () => {
            atraso = await atrasoService.criarAtraso({
                ponto_id: ponto.id,
                tempo_minutos: 5,
                tipo: 'ENTRADA'
            });
        });

        it('deve justificar um atraso com sucesso', async () => {
            const resultado = await atrasoService.justificarAtraso(
                atraso.id,
                'Trânsito intenso na BR-101'
            );

            expect(resultado.justificado).toBe(true);
            expect(resultado.motivo_justificativa).toBe('Trânsito intenso na BR-101');
        });

        it('deve lançar erro ATRASO_NAO_ENCONTRADO para ID inválido', async () => {
            await expect(atrasoService.justificarAtraso(99999, 'Motivo teste'))
                .rejects.toThrow('ATRASO_NAO_ENCONTRADO');
        });

        it('deve lançar erro MOTIVO_OBRIGATORIO quando motivo vazio', async () => {
            await expect(atrasoService.justificarAtraso(atraso.id, ''))
                .rejects.toThrow('MOTIVO_OBRIGATORIO');
        });
    });

    describe('listarAtrasosPorFuncionario()', () => {
        beforeEach(async () => {
            await atrasoService.criarAtraso({
                ponto_id: ponto.id,
                tempo_minutos: 5,
                tipo: 'ENTRADA'
            });
        });

        it('deve retornar lista de atrasos do funcionário', async () => {
            const atrasos = await atrasoService.listarAtrasosPorFuncionario(funcionario.cpf);

            expect(Array.isArray(atrasos)).toBe(true);
            expect(atrasos.length).toBe(1);
            expect(atrasos[0]).toHaveProperty('tempo_minutos', 5);
            expect(atrasos[0]).toHaveProperty('tipo', 'ENTRADA');
        });

        it('deve retornar array vazio quando funcionário não tem atrasos', async () => {
            const novoFuncionario = await Funcionario.create({
                cpf: '98765432109',
                nome: 'Maria Santos',
                email: 'maria@empresa.com',
            });

            const atrasos = await atrasoService.listarAtrasosPorFuncionario(novoFuncionario.cpf);
            expect(atrasos).toEqual([]);
        });

        it('deve lançar erro FUNCIONARIO_NAO_ENCONTRADO para CPF inválido', async () => {
            await expect(atrasoService.listarAtrasosPorFuncionario('99999999999'))
                .rejects.toThrow('FUNCIONARIO_NAO_ENCONTRADO');
        });
    });

    describe('listarAtrasosNaoJustificados()', () => {
        beforeEach(async () => {
            await atrasoService.criarAtraso({
                ponto_id: ponto.id,
                tempo_minutos: 5,
                tipo: 'ENTRADA'
            });
        });

        it('deve listar apenas atrasos não justificados', async () => {
            const naoJustificados = await atrasoService.listarAtrasosNaoJustificados(funcionario.cpf);

            expect(naoJustificados.length).toBe(1);
            expect(naoJustificados[0].justificado).toBe(false);
        });

        it('deve retornar array vazio quando todos estão justificados', async () => {
            const atrasos = await atrasoService.listarAtrasosNaoJustificados(funcionario.cpf);
            expect(atrasos.length).toBe(1);

            await atrasoService.justificarAtraso(atrasos[0].id, 'Justificado');

            const naoJustificados = await atrasoService.listarAtrasosNaoJustificados(funcionario.cpf);
            expect(naoJustificados).toEqual([]);
        });
    });
});