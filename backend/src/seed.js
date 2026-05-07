const { sequelize, Departamento, Funcionario } = require('./models');

async function seed() {

  await sequelize.sync({ force: true });

  const ti = await Departamento.create({
    nome: 'Tecnologia da Informação',
    sigla: 'TI'
  });

  const rh = await Departamento.create({
    nome: 'Recursos Humanos',
    sigla: 'RH'
  });

  await Funcionario.create({
    nome: 'Brenda Silva',
    email: 'brenda@clockingo.com',
    cpf: '12345678900',
    departamentoId: ti.id
  });

  await Funcionario.create({
    nome: 'Carlos Souza',
    email: 'carlos@clockingo.com',
    cpf: '98765432100',
    departamentoId: rh.id
  });

  console.log('Seed executado!');

  process.exit();
}

seed();