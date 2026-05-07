const { Escala } = require("../models");

async function seedEscalas() {

    const escalas = [
        {
            nome: "Escala Administrativa",
            entrada: "08:00",
            saida: "17:00",
            tolerancia: 15,
        },
        {
            nome: "Escala Comercial",
            entrada: "09:00",
            saida: "18:00",
            tolerancia: 10,
        },
        {
            nome: "Escala Suporte",
            entrada: "07:00",
            saida: "16:00",
            tolerancia: 5,
        },
    ];

    for (const escala of escalas) {

        const existe = await Escala.findOne({
            where: {
                nome: escala.nome,
            },
        });

        if (!existe) {

            await Escala.create(escala);

            console.log(`Escala criada: ${escala.nome}`);

        } else {

            console.log(`Escala já existe: ${escala.nome}`);

        }
    }
}

module.exports = seedEscalas;