const {
    Funcionario,
    Escala,
    Departamento,
} = require("../models");

async function seedFuncionarios() {

    const escalaADM = await Escala.findOne({
        where: {
            nome: "Escala Administrativa",
        },
    });

    const escalaCM = await Escala.findOne({
        where: {
            nome: "Escala Comercial",
        },
    });

    const escalaTI = await Escala.findOne({
        where: {
            nome: "Escala Suporte",
        },
    });

    const departamentoTI = await Departamento.findOne({
        where: {
            sigla: "TI",
        },
    });

    const departamentoRH = await Departamento.findOne({
        where: {
            sigla: "RH",
        },
    });

    const funcionarios = [
        {
            nome: "Carlos Souza",
            cpf: "98765432100",
            email: "carlos@clockingo.com",
            escala_id: escalaADM.id,
            departamentoId: departamentoRH.id,
        },
        {
            nome: "Brenda Silva",
            cpf: "12345678900",
            email: "brenda@clockingo.com",
            escala_id: escalaTI.id,
            departamentoId: departamentoTI.id,
        },
        {
            nome: "Antonio Lins",
            cpf: "00123456789",
            email: "antonio@clockingo.com",
            escala_id: escalaCM.id,
            departamentoId: departamentoRH.id,
        },
    ];

    for (const funcionario of funcionarios) {

        const existe = await Funcionario.findOne({
            where: {
                cpf: funcionario.cpf,
            },
        });

        if (!existe) {

            await Funcionario.create(funcionario);

            console.log(`Funcionário criado: ${funcionario.nome}`);

        } else {

            console.log(`Funcionário já existe: ${funcionario.nome}`);

        }
    }
}

module.exports = seedFuncionarios;