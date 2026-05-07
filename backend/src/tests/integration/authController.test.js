const request = require('supertest');
const app = require('../../app');
const { Funcionario, sequelize } = require('../../models');

describe('AuthController - Login', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/auth/login', () => {
        it('deve retornar 200 e os dados do funcionário quando CPF válido', async () => {
            // Arrange: criar funcionário
            await Funcionario.create({
                cpf: '12345678901',
                nome: 'João Silva',
                email: 'joao@empresa.com',
            });

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send({ cpf: '12345678901' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Login realizado com sucesso');
            expect(response.body.funcionario).toHaveProperty('nome', 'João Silva');
            expect(response.body.funcionario).toHaveProperty('cpf', '12345678901');
        });

        it('deve retornar 404 quando CPF não existe', async () => {
            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send({ cpf: '99999999999' });

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('erro', 'Funcionário não encontrado');
        });

        it('deve retornar 400 quando CPF não é enviado', async () => {
            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('erro', 'CPF é obrigatório');
        });

        it('deve aceitar CPF com formatação (pontos e traços)', async () => {
            // Arrange
            await Funcionario.create({
                cpf: '12345678901',
                nome: 'Maria Santos',
                email: 'maria@empresa.com',
            });

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send({ cpf: '123.456.789-01' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.funcionario).toHaveProperty('nome', 'Maria Santos');
        });

        it('não deve retornar campos sensíveis como endereço', async () => {
            // Arrange
            await Funcionario.create({
                cpf: '11122233344',
                nome: 'Carlos Lima',
                email: 'carlos@empresa.com',
                endereco: 'Rua Secreta, 123',
            });

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send({ cpf: '11122233344' });

            // Assert
            expect(response.body.funcionario).not.toHaveProperty('endereco');
        });
    });
});