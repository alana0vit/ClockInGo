const request = require('supertest');
const app = require('../../app');
const { Funcionario, Escala, Ponto, sequelize } = require('../../models');

describe('PontoController - TDD', () => {
    let funcionario;
    let escala;

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
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/ponto/entrada', () => {
        // TESTE 1: Deve registrar entrada com sucesso
        it('deve retornar 201 e registrar entrada', async () => {
            const response = await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Entrada registrada com sucesso');
            expect(response.body.ponto).toHaveProperty('entrada');
            expect(response.body.ponto.saida).toBeNull();
        });

        // TESTE 2: Deve retornar 400 se CPF não for enviado
        it('deve retornar 400 quando CPF não é enviado', async () => {
            const response = await request(app)
                .post('/api/ponto/entrada')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('erro', 'CPF é obrigatório');
        });

        // TESTE 3: Deve retornar 404 se funcionário não existir
        it('deve retornar 404 quando funcionário não existe', async () => {
            const response = await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: '99999999999' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Funcionário não encontrado');
        });

        // TESTE 4: Deve retornar 400 se já registrou entrada hoje
        it('deve retornar 400 quando já registrou entrada hoje', async () => {
            await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            const response = await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('erro', 'Você já registrou entrada hoje');
        });
    });

    describe('POST /api/ponto/saida', () => {
        // TESTE 5: Deve registrar saída com sucesso
        it('deve retornar 200 e registrar saída', async () => {
            await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            const response = await request(app)
                .post('/api/ponto/saida')
                .send({ cpf: funcionario.cpf });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Saída registrada com sucesso');
            expect(response.body.ponto).toHaveProperty('saida');
        });

        // TESTE 6: Deve retornar 400 se CPF não for enviado
        it('deve retornar 400 quando CPF não é enviado', async () => {
            const response = await request(app)
                .post('/api/ponto/saida')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('erro', 'CPF é obrigatório');
        });

        // TESTE 7: Deve retornar 404 se funcionário não existir
        it('deve retornar 404 quando funcionário não existe', async () => {
            const response = await request(app)
                .post('/api/ponto/saida')
                .send({ cpf: '99999999999' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Funcionário não encontrado');
        });

        // TESTE 8: Deve retornar 404 se não tiver registro de entrada hoje
        it('deve retornar 404 quando não há registro de entrada hoje', async () => {
            const response = await request(app)
                .post('/api/ponto/saida')
                .send({ cpf: funcionario.cpf });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Nenhum registro de ponto encontrado hoje');
        });
    });

    describe('GET /api/ponto/:cpf', () => {
        // TESTE 9: Deve listar pontos do funcionário
        it('deve retornar 200 e lista de pontos', async () => {
            await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            const response = await request(app)
                .get(`/api/ponto/${funcionario.cpf}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
        });

        // TESTE 10: Deve retornar 404 se funcionário não existir
        it('deve retornar 404 quando funcionário não existe', async () => {
            const response = await request(app)
                .get('/api/ponto/99999999999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Funcionário não encontrado');
        });

        // TESTE 11: Deve retornar array vazio se funcionário não tem pontos
        it('deve retornar array vazio quando funcionário não tem registros', async () => {
            const response = await request(app)
                .get(`/api/ponto/${funcionario.cpf}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('PUT /api/ponto/:id', () => {
        let pontoId;

        beforeEach(async () => {
            await request(app)
                .post('/api/ponto/entrada')
                .send({ cpf: funcionario.cpf });

            const response = await request(app)
                .get(`/api/ponto/${funcionario.cpf}`);
            pontoId = response.body[0].id;
        });

        // TESTE 12: Deve atualizar observação do ponto
        it('deve retornar 200 e atualizar observação', async () => {
            const response = await request(app)
                .put(`/api/ponto/${pontoId}`)
                .send({ observacao: 'Ajuste manual do RH' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Ponto atualizado com sucesso');
            expect(response.body.ponto).toHaveProperty('observacao', 'Ajuste manual do RH');
        });

        // TESTE 13: Deve retornar 404 se ponto não existir
        it('deve retornar 404 quando ponto não existe', async () => {
            const response = await request(app)
                .put('/api/ponto/99999')
                .send({ observacao: 'Teste' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Ponto não encontrado');
        });
    });
});