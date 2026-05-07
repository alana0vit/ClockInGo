const pontoService = require('../../services/pontoService');
const { Funcionario, Escala, Ponto, Atraso, sequelize } = require('../../models');

describe('PontoService - TDD', () => {
    let funcionario;
    let escala;

    // Limpa o banco antes de cada teste
    beforeEach(async () => {
        await sequelize.sync({ force: true });

        // Cria uma escala padrão
        escala = await Escala.create({
            nome: 'Comercial',
            entrada: '08:00:00',
            saida: '17:00:00',
            tolerancia: 15,
        });

        // Cria um funcionário com a escala
        funcionario = await Funcionario.create({
            cpf: '12345678901',
            nome: 'João Silva',
            email: 'joao@empresa.com',
            escala_id: escala.id,
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('registrarEntrada()', () => {
        // TESTE 1: Deve registrar entrada com sucesso
        it('deve registrar a entrada do funcionário no horário atual', async () => {
            const resultado = await pontoService.registrarEntrada(funcionario.cpf);

            expect(resultado).toHaveProperty('ponto');
            expect(resultado.ponto).toHaveProperty('entrada');
            expect(resultado.ponto.saida).toBeNull();
            expect(resultado).toHaveProperty('atraso', null);
        });

        // TESTE 2: Deve lançar erro se funcionário não existir
        it('deve lançar erro FUNCIONARIO_NAO_ENCONTRADO quando CPF inválido', async () => {
            await expect(pontoService.registrarEntrada('99999999999'))
                .rejects
                .toThrow('FUNCIONARIO_NAO_ENCONTRADO');
        });

        // TESTE 3: Não deve permitir dois registros de entrada no mesmo dia
        it('deve lançar erro PONTO_JA_REGISTRADO_HOJE ao tentar registrar entrada duas vezes', async () => {
            await pontoService.registrarEntrada(funcionario.cpf);

            await expect(pontoService.registrarEntrada(funcionario.cpf))
                .rejects
                .toThrow('PONTO_JA_REGISTRADO_HOJE');
        });

        // TESTE 4: Deve detectar atraso quando chegar depois da tolerância
        it('deve criar registro de atraso quando entrada for após a tolerância', async () => {
            const horarioAtrasado = new Date();
            horarioAtrasado.setHours(8, 20, 0); // 20 min atrasado (tolerância 15)

            const resultado = await pontoService.registrarEntrada(funcionario.cpf, horarioAtrasado);

            expect(resultado.atraso).not.toBeNull();
            expect(resultado.atraso.tipo).toBe('ENTRADA');
            expect(resultado.atraso.tempo_minutos).toBe(5); // 20 - 15 = 5 min de atraso efetivo
        });

        // TESTE 5: Não deve criar atraso se estiver dentro da tolerância
        it('não deve criar atraso quando entrada estiver dentro da tolerância', async () => {
            const horarioNoLimite = new Date();
            horarioNoLimite.setHours(8, 14, 0); // 14 min atrasado (tolerância 15)

            const resultado = await pontoService.registrarEntrada(funcionario.cpf, horarioNoLimite);

            expect(resultado.atraso).toBeNull();
        });
    });

    describe('registrarSaida()', () => {
        // TESTE 6: Deve registrar saída com sucesso
        it('deve registrar a saída do funcionário', async () => {
            await pontoService.registrarEntrada(funcionario.cpf);

            const resultado = await pontoService.registrarSaida(funcionario.cpf);

            expect(resultado.ponto.saida).not.toBeNull();
            expect(resultado).toHaveProperty('atraso', null);
        });

        // TESTE 7: Não deve permitir saída sem entrada no dia
        it('deve lançar erro PONTO_NAO_ENCONTRADO quando não há entrada no dia', async () => {
            await expect(pontoService.registrarSaida(funcionario.cpf))
                .rejects
                .toThrow('PONTO_NAO_ENCONTRADO');
        });

        // TESTE 8: Não deve permitir registrar saída duas vezes
        it('deve lançar erro SAIDA_JA_REGISTRADA ao tentar registrar saída duas vezes', async () => {
            await pontoService.registrarEntrada(funcionario.cpf);
            await pontoService.registrarSaida(funcionario.cpf);

            await expect(pontoService.registrarSaida(funcionario.cpf))
                .rejects
                .toThrow('SAIDA_JA_REGISTRADA');
        });

        // TESTE 9: Deve detectar saída antecipada
        it('deve criar registro de atraso quando sair antes do horário', async () => {
            await pontoService.registrarEntrada(funcionario.cpf);

            const horarioAntecipado = new Date();
            horarioAntecipado.setHours(16, 30, 0); // Saiu 30 min mais cedo

            const resultado = await pontoService.registrarSaida(funcionario.cpf, horarioAntecipado);

            expect(resultado.atraso).not.toBeNull();
            expect(resultado.atraso.tipo).toBe('SAIDA_ANTECIPADA');
            expect(resultado.atraso.tempo_minutos).toBe(30);
        });
    });

    describe('listarPontos()', () => {
        // TESTE 10: Deve listar todos os pontos do funcionário
        it('deve retornar array com todos os pontos do funcionário', async () => {
            await pontoService.registrarEntrada(funcionario.cpf);
            await pontoService.registrarSaida(funcionario.cpf);

            const pontos = await pontoService.listarPontos(funcionario.cpf);

            expect(Array.isArray(pontos)).toBe(true);
            expect(pontos.length).toBe(1);
            expect(pontos[0]).toHaveProperty('entrada');
            expect(pontos[0]).toHaveProperty('saida');
        });

        // TESTE 11: Deve lançar erro para funcionário inexistente
        it('deve lançar erro FUNCIONARIO_NAO_ENCONTRADO para CPF inválido', async () => {
            await expect(pontoService.listarPontos('99999999999'))
                .rejects
                .toThrow('FUNCIONARIO_NAO_ENCONTRADO');
        });

        // TESTE 12: Deve retornar array vazio se funcionário não tem pontos
        it('deve retornar array vazio quando funcionário não tem registros', async () => {
            const pontos = await pontoService.listarPontos(funcionario.cpf);
            expect(pontos).toEqual([]);
        });
    });

    describe('atualizarPonto()', () => {
        let ponto;

        beforeEach(async () => {
            await pontoService.registrarEntrada(funcionario.cpf);
            const pontos = await pontoService.listarPontos(funcionario.cpf);
            ponto = pontos[0];
        });

        // TESTE 13: Deve atualizar observação do ponto
        it('deve atualizar a observação do ponto', async () => {
            const resultado = await pontoService.atualizarPonto(ponto.id, {
                observacao: 'Ajuste manual do RH'
            });

            expect(resultado.observacao).toBe('Ajuste manual do RH');
        });

        // TESTE 14: Deve atualizar entrada e saída
        it('deve atualizar horários de entrada e saída', async () => {
            const novaEntrada = new Date();
            const novaSaida = new Date();
            novaSaida.setHours(novaSaida.getHours() + 8);

            const resultado = await pontoService.atualizarPonto(ponto.id, {
                entrada: novaEntrada,
                saida: novaSaida
            });

            expect(resultado.entrada).not.toBeNull();
            expect(resultado.saida).not.toBeNull();
        });

        // TESTE 15: Deve lançar erro para ponto inexistente
        it('deve lançar erro PONTO_NAO_ENCONTRADO para ID inválido', async () => {
            await expect(pontoService.atualizarPonto(99999, { observacao: 'Teste' }))
                .rejects
                .toThrow('PONTO_NAO_ENCONTRADO');
        });
    });
});