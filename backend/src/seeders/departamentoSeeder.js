const { Departamento } = require("../models");

async function seedDepartamento() {

    const departamentos = [
        {
            nome: "Tecnologia da Informação",
            sigla: "TI",
        },
        {
            nome: "Recursos Humanos",
            sigla: "RH",
        },
    ];

    for (const departamento of departamentos) {

        const existe = await Departamento.findOne({
            where: {
                sigla: departamento.sigla,
            },
        });

        if (!existe) {

            await Departamento.create(departamento);

            console.log(`Departamento criado: ${departamento.nome}`);

        } else {

            console.log(`Departamento já existe: ${departamento.nome}`);

        }
    }
}

module.exports = seedDepartamento;