const authService = require('../../services/authService');
const { Funcionario, sequelize } = require('../../models');

describe('AuthService - Login', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('login()', () => {
        it('deve retornar o funcionário quando CPF existe', async () => {
            // Arrange: criar um funcionário no banco
            const funcionarioCriado = await Funcionario.create({
                cpf: '12345678901',
                nome: 'João Silva',
                email: 'joao@empresa.com',
            });

            // Act: tentar fazer login
            const resultado = await authService.login('12345678901');

            // Assert: deve retornar o funcionário
            expect(resultado).toHaveProperty('id', funcionarioCriado.id);
            expect(resultado).toHaveProperty('nome', 'João Silva');
            expect(resultado).toHaveProperty('cpf', '12345678901');
            expect(resultado).toHaveProperty('email', 'joao@empresa.com');
        });

        it('deve lançar erro FUNCIONARIO_NAO_ENCONTRADO quando CPF não existe', async () => {
            // Act & Assert
            await expect(authService.login('99999999999'))
                .rejects
                .toThrow('FUNCIONARIO_NAO_ENCONTRADO');
        });

        it('deve funcionar com CPF formatado (com pontos e traços)', async () => {
            // Arrange
            await Funcionario.create({
                cpf: '12345678901',
                nome: 'Maria Santos',
                email: 'maria@empresa.com',
            });

            // Act
            const resultado = await authService.login('123.456.789-01');

            // Assert
            expect(resultado).toHaveProperty('nome', 'Maria Santos');
        });

        it('deve retornar apenas os campos id, nome, cpf, email', async () => {
            // Arrange
            await Funcionario.create({
                cpf: '11122233344',
                nome: 'Carlos Lima',
                email: 'carlos@empresa.com',
                endereco: 'Rua Secreta, 123', // esse campo não deve vir
            });

            // Act
            const resultado = await authService.login('11122233344');

            // Assert
            expect(resultado).toHaveProperty('id');
            expect(resultado).toHaveProperty('nome');
            expect(resultado).toHaveProperty('cpf');
            expect(resultado).toHaveProperty('email');
            expect(resultado).not.toHaveProperty('endereco');
        });
    });
});