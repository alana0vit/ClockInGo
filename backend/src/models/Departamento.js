const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Departamento extends Model {}

Departamento.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sigla: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Departamento",
    tableName: "departamentos",
  },
);

module.exports = Departamento;
