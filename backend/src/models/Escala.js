const {DataTypes, Model} = require("sequelize");
const sequelize = require("../config/database");

class Escala extends Model {}

Escala.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entrada: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    saida: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    tolerancia: {
        type: DataTypes.INTEGER, 
        defaultValue: 15
    }
}, {
    sequelize, 
    modelName: "Escala",
    tableName: "escalas",
    underscored: true
});

module.exports = Escala;