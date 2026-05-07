const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Ponto extends Model { }

Ponto.init(
  {
    data_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    entrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    saida: {
      type: DataTypes.DATE,
      allowNull: true, // Pode ser nulo, pois pode ficar assim até o fim do expediente
    },
    observacao: {
      type: DataTypes.STRING,
      allowNull: true, // Caso o RH insira algo
    },
    funcionario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Ponto",
    tableName: "pontos",
    underscored: true,
  },
);

module.exports = Ponto;
